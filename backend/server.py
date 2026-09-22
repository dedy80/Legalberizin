from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# --- Emergent managed email (Resend proxy) — lead notifications ---
import asyncio
import re
import ipaddress
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Legalberizin.id")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str = None):
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as http_client:
        resp = await http_client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


async def notify_new_lead(lead: dict):
    try:
        if not (EMAIL_KEY and NOTIFY_EMAIL):
            return
        subject = f"Lead Baru Website: {lead.get('service', '-')} - {lead.get('name', '-')}"
        fields = [
            ("Nama", lead.get("name") or "-"),
            ("WhatsApp", lead.get("phone") or "-"),
            ("Email", lead.get("email") or "-"),
            ("Layanan", lead.get("service") or "-"),
            ("Pesan", lead.get("message") or "-"),
        ]
        rows = "".join(
            f'<tr><td style="padding:6px 12px 6px 0;color:#9CA3AF;font-size:13px;vertical-align:top;white-space:nowrap">{escape(k)}</td>'
            f'<td style="padding:6px 0;color:#F9FAFB;font-size:13px">{escape(str(v))}</td></tr>'
            for k, v in fields
        )
        html = (
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F17;padding:24px">'
            '<tr><td style="font-family:Arial,sans-serif;background:#111827;border-radius:12px;padding:32px">'
            '<h2 style="margin:0 0 4px;color:#00F0FF;font-size:20px">Lead Konsultasi Baru</h2>'
            '<p style="margin:0 0 20px;color:#9CA3AF;font-size:13px">Masuk melalui form konsultasi website Legalberizin.id</p>'
            f'<table role="presentation" cellpadding="0" cellspacing="0">{rows}</table>'
            f'<p style="margin:24px 0 0;font-size:12px;color:#6B7280">Email otomatis dari website {escape(EMAIL_FROM_NAME)}. Segera hubungi lead via WhatsApp.</p>'
            '</td></tr></table>'
        )
        await send_email(to=NOTIFY_EMAIL, subject=subject, html=html)
    except Exception as e:
        logging.getLogger(__name__).error("lead notify email failed: %s", e)
# --- end email block ---

app = FastAPI()
api_router = APIRouter(prefix="/api")


# --- Admin auth (JWT) ---
import bcrypt
import jwt as pyjwt
from fastapi import Depends, Request
from datetime import timedelta

JWT_ALGORITHM = "HS256"
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, "email": email, "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return pyjwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Tidak terautentikasi")
    try:
        payload = pyjwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token tidak valid")
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token kedaluwarsa, silakan login ulang")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user


class LoginRequest(BaseModel):
    email: str
    password: str


@api_router.post("/auth/login")
async def login(req: LoginRequest, request: Request):
    email = req.email.strip().lower()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = attempts.get("locked_until", "")
        if locked_until > datetime.now(timezone.utc).isoformat():
            raise HTTPException(status_code=429, detail="Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        now = datetime.now(timezone.utc)
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": (now + timedelta(minutes=LOCK_MINUTES)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Email atau password salah")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": "admin"}}


@api_router.get("/auth/me")
async def auth_me(user=Depends(get_current_user)):
    return user


async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": email, "password_hash": hash_password(password),
            "name": "Admin", "role": "admin", "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
# --- end admin auth ---


class ConsultationCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service: str
    message: Optional[str] = None


class Consultation(ConsultationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    session_id: str
    message: str


SYSTEM_MESSAGE = """Kamu adalah LegalAI, asisten konsultasi virtual resmi Legalberizin.id — konsultan legalitas & perizinan usaha di Jakarta Utara, Indonesia.

Layanan Legalberizin.id:
1. Pendirian Badan Usaha: PT, PT PMDN/PMA, PT Perorangan, CV, Yayasan (akta notaris, SK Kemenkumham, NPWP, NIB via OSS-RBA).
2. Virtual Office di Jakarta Utara (alamat bisnis legal, zonasi komersial, surat domisili).
3. Sertifikat Standar KBLI 46441 (perdagangan besar farmasi/obat untuk manusia).
4. Izin BPOM Kosmetik Impor (registrasi produk, LoA, CFS, dokumen GMP).
5. Notifikasi Izin Edar Kosmetik Impor (nomor NA).
6. Izin Distribusi Alat Kesehatan (IDAK, pengganti IPAK, dari Kemenkes).
7. Sertifikat CDAKB (Cara Distribusi Alat Kesehatan yang Baik).
8. Izin Edar Alat Kesehatan Impor (AKL) dari Kemenkes.
9. Layanan Digital (NIB/OSS, perubahan akta, PKP, company profile).

Kontak: WhatsApp 085171114889, email hredu.pusat@gmail.com, kantor di Jakarta Utara.

Aturan: jawab dalam Bahasa Indonesia yang ramah, profesional, dan ringkas (maksimal 3-4 paragraf pendek). Berikan gambaran umum syarat & alur, tapi untuk estimasi biaya pasti dan penanganan dokumen selalu arahkan user untuk konsultasi gratis via WhatsApp 085171114889 atau isi form konsultasi di website. Jangan mengaku sebagai pengacara; kamu asisten informasi layanan."""


@api_router.get("/")
async def root():
    return {"message": "Legalberizin.id API"}


@api_router.post("/consultations", response_model=Consultation)
async def create_consultation(input: ConsultationCreate):
    obj = Consultation(**input.model_dump())
    await db.consultations.insert_one(obj.model_dump())
    asyncio.create_task(notify_new_lead(obj.model_dump()))
    return obj


@api_router.get("/consultations", response_model=List[Consultation])
async def list_consultations(user=Depends(get_current_user)):
    return await db.consultations.find({}, {"_id": 0}).to_list(1000)


@api_router.post("/chat")
async def chat(req: ChatRequest):
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()), "session_id": req.session_id,
        "role": "user", "content": req.message, "created_at": now,
    })
    history = await db.chat_messages.find(
        {"session_id": req.session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(30)
    context = "\n".join(
        f"{'User' if m['role'] == 'user' else 'Asisten'}: {m['content']}" for m in history[:-1]
    )
    prompt = (f"Riwayat percakapan:\n{context}\n\n" if context else "") + f"User: {req.message}"

    async def event_generator():
        full = ""
        try:
            llm = LlmChat(
                api_key=os.environ["EMERGENT_LLM_KEY"],
                session_id=req.session_id,
                system_message=SYSTEM_MESSAGE,
            ).with_model("openai", "gpt-5.4-mini")
            async for ev in llm.stream_message(UserMessage(text=prompt)):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logging.getLogger(__name__).error("chat error: %s", e)
            yield f"data: {json.dumps({'delta': 'Maaf, asisten sedang sibuk. Silakan hubungi WhatsApp 085171114889 untuk konsultasi langsung.'})}\n\n"
        await db.chat_messages.insert_one({
            "id": str(uuid.uuid4()), "session_id": req.session_id,
            "role": "assistant", "content": full,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# --- Blog ---
from fastapi import HTTPException


class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    excerpt: str
    category: str
    read_time: str
    published_at: str
    content: Optional[str] = None


class BlogPostInput(BaseModel):
    slug: str
    title: str
    excerpt: str
    category: str
    read_time: str
    published_at: str
    content: str


@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(input: BlogPostInput, user=Depends(get_current_user)):
    if await db.blog_posts.find_one({"slug": input.slug}):
        raise HTTPException(status_code=400, detail="Slug sudah digunakan, ganti judul atau slug")
    post = BlogPost(**input.model_dump())
    await db.blog_posts.insert_one(post.model_dump())
    return post


@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, input: BlogPostInput, user=Depends(get_current_user)):
    res = await db.blog_posts.update_one({"id": post_id}, {"$set": input.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
    return await db.blog_posts.find_one({"id": post_id}, {"_id": 0})


@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, user=Depends(get_current_user)):
    res = await db.blog_posts.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
    return {"ok": True}


BLOG_SEED = [
    {
        "slug": "perbedaan-pt-cv-yayasan",
        "title": "PT, CV, atau Yayasan: Badan Usaha Mana yang Tepat untuk Bisnis Anda?",
        "excerpt": "Sebelum mendaftarkan bisnis, pahami dulu perbedaan PT, CV, dan Yayasan — dari tanggung jawab hukum, modal, hingga perpajakannya.",
        "category": "Badan Usaha",
        "read_time": "5 menit baca",
        "published_at": "2026-09-10",
        "content": """
<p>Memilih bentuk badan usaha adalah keputusan legal pertama yang menentukan masa depan bisnis Anda. Salah pilih sejak awal bisa berakibat pada tanggung jawab hukum yang tidak perlu, kesulitan mengajukan perizinan lanjutan, hingga beban pajak yang kurang efisien.</p>
<h2>Perseroan Terbatas (PT)</h2>
<p>PT adalah badan hukum yang kekayaannya terpisah dari kekayaan pribadi pemiliknya. Artinya, tanggung jawab pemegang saham terbatas pada modal yang disetor. PT cocok untuk bisnis yang ingin berkembang, mencari investor, atau mengikuti tender pemerintah dan perusahaan besar.</p>
<ul>
<li>Minimal 2 pendiri (kecuali PT Perorangan untuk UMKM)</li>
<li>Akta notaris dan pengesahan Kemenkumham</li>
<li>Modal dasar ditentukan pendiri sesuai UU Cipta Kerja</li>
<li>Bisa berbentuk PT PMDN (dalam negeri) atau PT PMA (penanaman modal asing)</li>
</ul>
<h2>Commanditaire Vennootschap (CV)</h2>
<p>CV bukan badan hukum, sehingga pendiriannya lebih sederhana dan biayanya lebih rendah. Namun ada dua jenis sekutu: sekutu aktif yang bertanggung jawab penuh sampai harta pribadi, dan sekutu pasif yang hanya menyetor modal. CV cocok untuk usaha kecil-menengah yang belum membutuhkan struktur sekompleks PT.</p>
<h2>Yayasan</h2>
<p>Yayasan adalah badan hukum nirlaba untuk kegiatan sosial, keagamaan, dan kemanusiaan. Yayasan tidak memiliki pemilik atau pembagian keuntungan — asetnya dikunci untuk tujuan pendiriannya. Cocok untuk lembaga pendidikan, rumah ibadah, dan organisasi sosial.</p>
<h2>Jadi, Mana yang Tepat?</h2>
<p>Pilih PT jika Anda serius membangun bisnis jangka panjang dan butuh perlindungan hukum maksimal. Pilih CV untuk memulai cepat dengan biaya rendah. Pilih Yayasan jika tujuan Anda sosial, bukan profit.</p>
<p>Masih ragu? Tim Legalberizin.id siap membantu Anda memilih bentuk badan usaha yang paling sesuai melalui konsultasi gratis. Hubungi kami via WhatsApp di 0851-7111-4889.</p>
""",
    },
    {
        "slug": "panduan-izin-bpom-kosmetik-impor",
        "title": "Panduan Lengkap Izin BPOM untuk Kosmetik Impor: Syarat & Alurnya",
        "excerpt": "Kosmetik impor wajib terdaftar di BPOM sebelum dijual. Ini panduan lengkap dokumen, alur registrasi, dan kesalahan yang paling sering terjadi.",
        "category": "BPOM",
        "read_time": "7 menit baca",
        "published_at": "2026-09-14",
        "content": """
<p>Indonesia adalah pasar kosmetik yang besar, tetapi setiap produk kosmetik impor wajib memiliki notifikasi dari BPOM sebelum diedarkan. Menjual produk tanpa nomor izin edar berisiko penarikan produk, pemblokiran toko online, hingga sanksi pidana.</p>
<h2>Dokumen Wajib dari Principal</h2>
<ul>
<li><strong>Letter of Appointment (LoA)</strong> — surat penunjukan resmi dari pemilik brand kepada perusahaan Anda sebagai pendaftar di Indonesia.</li>
<li><strong>Certificate of Free Sale (CFS)</strong> — bukti produk dijual bebas di negara asal, dilegalisasi sesuai ketentuan.</li>
<li><strong>Sertifikat GMP/CPKB</strong> — bukti produsen menerapkan cara pembuatan kosmetik yang baik.</li>
<li><strong>Formula lengkap (INCI) dan spesifikasi produk</strong> — termasuk fungsi, cara pakai, dan desain label.</li>
</ul>
<h2>Alur Registrasi</h2>
<p>Pertama, perusahaan Anda didaftarkan pada sistem notifikasi kosmetik BPOM dan lolos verifikasi fasilitas. Kedua, setiap varian produk (SKU) diajukan satu per satu dengan dokumen yang sudah disiapkan. Ketiga, BPOM melakukan evaluasi — umumnya 1 sampai 3 bulan — sebelum nomor notifikasi (NA) terbit.</p>
<h2>Kesalahan yang Paling Sering Terjadi</h2>
<ul>
<li>Klaim berlebihan pada label (misalnya klaim seperti obat) yang membuat pengajuan ditolak.</li>
<li>Dokumen CFS atau LoA kedaluwarsa atau tidak sesuai format.</li>
<li>Nama produk tidak konsisten antara dokumen dan label.</li>
</ul>
<h2>Tips Mempercepat Persetujuan</h2>
<p>Pastikan label sudah memenuhi ketentuan BPOM sejak awal, termasuk informasi wajib berbahasa Indonesia. Gunakan konsultan berpengalaman agar tidak bolak-balik revisi. Legalberizin.id mendampingi proses ini dari penyiapan dokumen hingga nomor NA terbit — konsultasi gratis via WhatsApp 0851-7111-4889.</p>
""",
    },
    {
        "slug": "keuntungan-virtual-office-untuk-bisnis",
        "title": "5 Keuntungan Virtual Office untuk Legalitas dan Efisiensi Bisnis",
        "excerpt": "Virtual office bukan sekadar alamat. Ini cara cerdas mendapatkan domisili legal untuk pendirian PT/CV tanpa menguras modal sewa kantor.",
        "category": "Virtual Office",
        "read_time": "4 menit baca",
        "published_at": "2026-09-18",
        "content": """
<p>Bagi banyak founder, menyewa kantor fisik di tahun pertama bisnis adalah pemborosan. Virtual office menjawab kebutuhan itu: alamat bisnis resmi tanpa biaya operasional gedung. Berikut lima keuntungannya.</p>
<h2>1. Domisili Resmi untuk Pendirian Badan Usaha</h2>
<p>Virtual office di zonasi komersial — seperti layanan kami di Jakarta Utara — sah digunakan sebagai alamat pendirian PT atau CV, pengurusan NIB di OSS, dan NPWP perusahaan. Ini syarat penting yang tidak bisa dipenuhi alamat rumah di banyak daerah.</p>
<h2>2. Hemat Biaya hingga 90%</h2>
<p>Dibandingkan sewa kantor konvensional di Jakarta, virtual office hanya membutuhkan biaya sepersennya saja per tahun. Dana yang dihemat bisa dialokasikan ke produk dan pemasaran.</p>
<h2>3. Citra Profesional</h2>
<p>Alamat bisnis di kawasan komersial meningkatkan kepercayaan klien, bank, dan calon investor dibanding alamat rumahan.</p>
<h2>4. Layanan Operasional Pendukung</h2>
<p>Penerimaan surat dan paket atas nama perusahaan Anda tetap berjalan, sehingga korespondensi resmi tidak pernah terlewat.</p>
<h2>5. Fleksibel untuk Bisnis Digital</h2>
<p>Tim bisa bekerja dari mana saja sementara legalitas perusahaan tetap rapi — kombinasi ideal untuk bisnis modern.</p>
<p>Tertarik? Legalberizin.id menyediakan virtual office di Jakarta Utara lengkap dengan surat domisili resmi. Konsultasi gratis via WhatsApp 0851-7111-4889.</p>
""",
    },
]


@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog_posts():
    return await db.blog_posts.find({}, {"_id": 0, "content": 0}).sort("published_at", -1).to_list(100)


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
    return post


@app.on_event("startup")
async def seed_blog():
    if await db.blog_posts.count_documents({}) == 0:
        for p in BLOG_SEED:
            p.setdefault("id", str(uuid.uuid4()))
        await db.blog_posts.insert_many(BLOG_SEED)
    await seed_admin()
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
# --- end blog ---


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
