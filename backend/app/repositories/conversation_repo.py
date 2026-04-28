import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.conversation import Conversation, Message, MessageRole


class ConversationRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(self, owner_id: uuid.UUID, title: str = "New Conversation") -> Conversation:
        conv = Conversation(owner_id=owner_id, title=title)
        self._db.add(conv)
        await self._db.commit()
        await self._db.refresh(conv)
        return conv

    async def get_by_id(self, conv_id: uuid.UUID) -> Conversation | None:
        result = await self._db.execute(
            select(Conversation)
            .where(Conversation.id == conv_id)
            .options(selectinload(Conversation.messages))
        )
        return result.scalar_one_or_none()

    async def list_by_owner(self, owner_id: uuid.UUID) -> list[Conversation]:
        result = await self._db.execute(
            select(Conversation)
            .where(Conversation.owner_id == owner_id)
            .order_by(Conversation.updated_at.desc())
        )
        return list(result.scalars().all())

    async def add_message(
        self,
        conv_id: uuid.UUID,
        role: MessageRole,
        content: str,
        sources: list | None = None,
    ) -> Message:
        msg = Message(
            conversation_id=conv_id,
            role=role,
            content=content,
            sources=sources,
        )
        self._db.add(msg)
        await self._db.commit()
        await self._db.refresh(msg)
        return msg
