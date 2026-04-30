import tiktoken
from openai import AsyncOpenAI

from app.config import settings

_client: AsyncOpenAI | None = None
_enc = tiktoken.get_encoding("cl100k_base")

EMBEDDING_MODEL = "text-embedding-3-small"


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def count_tokens(text: str) -> int:
    return len(_enc.encode(text))


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    tokens = _enc.encode(text)
    chunks: list[str] = []
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunks.append(_enc.decode(tokens[start:end]))
        if end == len(tokens):
            break
        start += chunk_size - overlap
    return chunks


async def embed_texts(texts: list[str]) -> list[list[float]]:
    if not settings.openai_api_key or settings.openai_api_key.startswith("sk-..."):
        return []

    client = _get_client()
    try:
        response = await client.embeddings.create(input=texts, model=EMBEDDING_MODEL)
        return [item.embedding for item in response.data]
    except Exception:
        return []


async def embed_query(text: str) -> list[float]:
    embeddings = await embed_texts([text])
    if embeddings:
        return embeddings[0]
    return []
