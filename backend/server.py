from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
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
    whatsapp: str
    email: Optional[str] = None
    service: str
    legal_status: str
    timeline: str
    domicile: str
    message: Optional[str] = None


class Consultation(ConsultationCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Legalberizin.id API"}


@api_router.post("/consultations", response_model=Consultation)
async def create_consultation(input: ConsultationCreate):
    if not input.name.strip() or not input.whatsapp.strip():
        raise HTTPException(status_code=400, detail="Nama dan WhatsApp wajib diisi")
    obj = Consultation(**input.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.consultations.insert_one(doc)
    return obj


@api_router.get("/consultations", response_model=List[Consultation])
async def list_consultations():
    items = await db.consultations.find({}, {"_id": 0}).to_list(1000)
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items


class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    slug: str
    title: str
    category: str
    excerpt: str
    read_time: str
    published_at: str
    sections: list


@api_router.get("/articles", response_model=List[Article])
async def list_articles():
    return await db.articles.find({}, {"_id": 0}).sort("published_at", -1).to_list(100)


@api_router.get("/articles/{slug}", response_model=Article)
async def get_article(slug: str):
    doc = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
    return doc


app.include_router(api_router)

from articles_seed import ARTICLES

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_articles():
    for article in ARTICLES:
        await db.articles.update_one({"slug": article["slug"]}, {"$set": article}, upsert=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
