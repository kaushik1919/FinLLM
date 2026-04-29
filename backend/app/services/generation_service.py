import json
from collections.abc import AsyncGenerator

from anthropic import AsyncAnthropic

from app.config import settings

_client: AsyncAnthropic | None = None

SYSTEM_PROMPT = """You are a financial intelligence assistant. Answer questions accurately using the provided document context.
If the context does not contain enough information to answer, say so clearly.
Cite the source documents when referencing specific data."""


def _get_client() -> AsyncAnthropic:
    global _client
    if _client is None:
        _client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


def _build_context(chunks: list[dict]) -> str:
    parts: list[str] = []
    for i, chunk in enumerate(chunks, 1):
        filename = chunk["metadata"].get("filename", "unknown")
        parts.append(f"[Source {i}: {filename}]\n{chunk['text']}")
    return "\n\n---\n\n".join(parts)


async def stream_response(
    query: str,
    chunks: list[dict],
    history: list[dict],
) -> AsyncGenerator[str, None]:
    context = _build_context(chunks)
    client = _get_client()

    messages = list(history)
    messages.append({
        "role": "user",
        "content": f"Context:\n{context}\n\nQuestion: {query}",
    })

    sources = [
        {
            "document_id": c["metadata"].get("document_id"),
            "filename": c["metadata"].get("filename"),
            "chunk_index": c["metadata"].get("chunk_index"),
        }
        for c in chunks
    ]

    yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

    async with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield f"data: {json.dumps({'type': 'delta', 'delta': text})}\n\n"

    yield "data: [DONE]\n\n"
