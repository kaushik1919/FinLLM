import uuid

import chromadb

from app.config import settings
from app.services.embedding_service import embed_query


async def retrieve_chunks(
    query: str,
    user_id: uuid.UUID,
    chroma: chromadb.HttpClient,
) -> list[dict]:
    query_embedding = await embed_query(query)
    collection = chroma.get_or_create_collection(settings.chroma_collection)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=settings.retrieval_top_k,
        where={"user_id": str(user_id)},
        include=["documents", "metadatas", "distances"],
    )

    chunks: list[dict] = []
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for text, meta, dist in zip(docs, metas, distances):
        chunks.append({"text": text, "metadata": meta, "distance": dist})

    chunks.sort(key=lambda c: c["distance"])
    return chunks[: settings.rerank_top_k]
