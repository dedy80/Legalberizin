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
