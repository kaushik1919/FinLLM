import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.conversation import MessageRole


class MessageOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    role: MessageRole
    content: str
    sources: list | None
    created_at: datetime


class ConversationOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime


class ConversationDetail(ConversationOut):
    messages: list[MessageOut]


class ChatMessageRequest(BaseModel):
    content: str


class StartConversationRequest(BaseModel):
    title: str = "New Conversation"
