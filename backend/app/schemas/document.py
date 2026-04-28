import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.document import DocumentStatus


class DocumentOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    filename: str
    file_size: int
    status: DocumentStatus
    chunk_count: int
    error_message: str | None
    created_at: datetime
