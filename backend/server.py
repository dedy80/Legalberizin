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
6. Izin Alkes Impor (IPAK, izin edar alat kesehatan Kemenkes).
7. Layanan Digital (NIB/OSS, perubahan akta, PKP, company profile).

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
async def list_consultations():
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
