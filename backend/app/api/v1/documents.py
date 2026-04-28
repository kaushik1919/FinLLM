import uuid

import chromadb
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_chroma, get_current_user, get_db
from app.models.user import User
from app.repositories.document_repo import DocumentRepository
from app.schemas.document import DocumentOut
from app.services.document_service import delete_document, upload_document

router = APIRouter()


@router.post("/upload", response_model=DocumentOut, status_code=202)
async def upload(
    file: UploadFile,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    chroma: chromadb.HttpClient = Depends(get_chroma),
    current_user: User = Depends(get_current_user),
):
    doc = await upload_document(file, current_user.id, db, chroma)
    return doc


@router.get("", response_model=list[DocumentOut])
async def list_documents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = DocumentRepository(db)
    return await repo.list_by_owner(current_user.id)


@router.get("/{document_id}", response_model=DocumentOut)
async def get_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = DocumentRepository(db)
    doc = await repo.get_by_id(document_id)
    if not doc or doc.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc


@router.delete("/{document_id}", status_code=204)
async def delete(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    chroma: chromadb.HttpClient = Depends(get_chroma),
    current_user: User = Depends(get_current_user),
):
    await delete_document(document_id, current_user.id, db, chroma)
