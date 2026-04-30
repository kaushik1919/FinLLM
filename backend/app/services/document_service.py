import io
import logging
import uuid
from pathlib import Path

import aiofiles
import chromadb
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.document import DocumentStatus
from app.repositories.document_repo import DocumentRepository
from app.services.embedding_service import chunk_text, embed_texts

logger = logging.getLogger(__name__)

try:
    import PyPDF2
    from docx import Document as DocxDocument
except ImportError:
    PyPDF2 = None
    DocxDocument = None


async def _extract_text(filename: str, data: bytes) -> str:
    ext = Path(filename).suffix.lower()
    if ext == ".pdf" and PyPDF2:
        reader = PyPDF2.PdfReader(io.BytesIO(data))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if ext == ".docx" and DocxDocument:
        doc = DocxDocument(io.BytesIO(data))
        return "\n".join(p.text for p in doc.paragraphs)
    return data.decode("utf-8", errors="replace")


async def upload_document(
    file: UploadFile,
    owner_id: uuid.UUID,
    db: AsyncSession,
    chroma: chromadb.HttpClient,
) -> dict:
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    data = await file.read()
    if len(data) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.max_upload_size_mb}MB limit",
        )

    storage_root = Path(settings.storage_path) / str(owner_id)
    storage_root.mkdir(parents=True, exist_ok=True)

    doc_id = uuid.uuid4()
    safe_filename = file.filename or "upload"
    disk_path = storage_root / f"{doc_id}_{safe_filename}"

    repo = DocumentRepository(db)
    doc = await repo.create(
        id=doc_id,
        owner_id=owner_id,
        filename=safe_filename,
        file_path=str(disk_path),
        file_size=len(data),
    )

    async with aiofiles.open(disk_path, "wb") as f:
        await f.write(data)

    doc = await repo.update_status(doc.id, DocumentStatus.processing)

    try:
        text = await _extract_text(safe_filename, data)
        chunks = chunk_text(text, settings.chunk_size_tokens, settings.chunk_overlap_tokens)
        embeddings = await embed_texts(chunks)

        if embeddings and len(embeddings) == len(chunks):
            collection = chroma.get_or_create_collection(settings.chroma_collection)
            collection.upsert(
                ids=[f"{doc.id}_{i}" for i in range(len(chunks))],
                embeddings=embeddings,
                documents=chunks,
                metadatas=[
                    {"document_id": str(doc.id), "user_id": str(owner_id), "chunk_index": i, "filename": safe_filename}
                    for i in range(len(chunks))
                ],
            )
        else:
            logger.warning("Skipping Chroma indexing for %s because embeddings are unavailable", doc.id)

        doc = await repo.update_status(doc.id, DocumentStatus.ready, chunk_count=len(chunks))
    except Exception as exc:
        await repo.update_status(doc.id, DocumentStatus.failed, error_message=str(exc))
        raise

    return doc


async def delete_document(
    document_id: uuid.UUID,
    owner_id: uuid.UUID,
    db: AsyncSession,
    chroma: chromadb.HttpClient,
) -> None:
    repo = DocumentRepository(db)
    doc = await repo.get_by_id(document_id)
    if not doc or doc.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    try:
        collection = chroma.get_or_create_collection(settings.chroma_collection)
        ids = [f"{document_id}_{i}" for i in range(doc.chunk_count)]
        if ids:
            collection.delete(ids=ids)
    except Exception:
        logger.warning("Failed to delete ChromaDB chunks for document %s", document_id)

    file_path = Path(doc.file_path)
    if file_path.exists():
        file_path.unlink(missing_ok=True)

    await repo.delete(document_id)
