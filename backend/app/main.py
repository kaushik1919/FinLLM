from contextlib import asynccontextmanager

import chromadb
import redis.asyncio as aioredis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as v1_router
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    app.state.chroma = chromadb.HttpClient(
        host=settings.chroma_host, port=settings.chroma_port
    )
    yield
    await app.state.redis.aclose()


app = FastAPI(
    title="FinLLM API",
    version="1.0.0",
    description="Financial LLM RAG assistant API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")
