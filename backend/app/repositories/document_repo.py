import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document, DocumentStatus


class DocumentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_by_id(self, document_id: uuid.UUID) -> Document | None:
        result = await self._db.execute(select(Document).where(Document.id == document_id))
        return result.scalar_one_or_none()

    async def list_by_owner(self, owner_id: uuid.UUID) -> list[Document]:
        result = await self._db.execute(
            select(Document)
            .where(Document.owner_id == owner_id)
            .order_by(Document.created_at.desc())
        )
        return list(result.scalars().all())

    async def create(
        self,
        owner_id: uuid.UUID,
        filename: str,
        file_path: str,
        file_size: int,
    ) -> Document:
        doc = Document(
            owner_id=owner_id,
            filename=filename,
            file_path=file_path,
            file_size=file_size,
        )
        self._db.add(doc)
        await self._db.commit()
        await self._db.refresh(doc)
        return doc

    async def update_status(
        self,
        document_id: uuid.UUID,
        status: DocumentStatus,
        chunk_count: int = 0,
        error_message: str | None = None,
    ) -> Document | None:
        doc = await self.get_by_id(document_id)
        if doc is None:
            return None
        doc.status = status
        doc.chunk_count = chunk_count
        if error_message is not None:
            doc.error_message = error_message
        await self._db.commit()
        await self._db.refresh(doc)
        return doc

    async def delete(self, document_id: uuid.UUID) -> bool:
        doc = await self.get_by_id(document_id)
        if doc is None:
            return False
        await self._db.delete(doc)
        await self._db.commit()
        return True
