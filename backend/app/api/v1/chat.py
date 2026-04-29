import json
import uuid

import chromadb
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_chroma, get_current_user, get_db
from app.models.conversation import MessageRole
from app.models.user import User
from app.repositories.conversation_repo import ConversationRepository
from app.schemas.conversation import (
    ChatMessageRequest,
    ConversationDetail,
    ConversationOut,
    StartConversationRequest,
)
from app.services.generation_service import stream_response
from app.services.retrieval_service import retrieve_chunks

router = APIRouter()


@router.post("/start", response_model=ConversationOut, status_code=201)
async def start_conversation(
    payload: StartConversationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ConversationRepository(db)
    return await repo.create(current_user.id, payload.title)


@router.get("/history", response_model=list[ConversationOut])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ConversationRepository(db)
    return await repo.list_by_owner(current_user.id)


@router.get("/{conv_id}", response_model=ConversationDetail)
async def get_conversation(
    conv_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ConversationRepository(db)
    conv = await repo.get_by_id(conv_id)
    if not conv or conv.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return conv


@router.post("/{conv_id}/message")
async def send_message(
    conv_id: uuid.UUID,
    payload: ChatMessageRequest,
    db: AsyncSession = Depends(get_db),
    chroma: chromadb.HttpClient = Depends(get_chroma),
    current_user: User = Depends(get_current_user),
):
    repo = ConversationRepository(db)
    conv = await repo.get_by_id(conv_id)
    if not conv or conv.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    await repo.add_message(conv_id, MessageRole.user, payload.content)

    chunks = await retrieve_chunks(payload.content, current_user.id, chroma)

    history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in conv.messages
    ]

    full_response: list[str] = []

    async def event_stream():
        async for chunk in stream_response(payload.content, chunks, history):
            yield chunk
            try:
                data = json.loads(chunk.removeprefix("data: ").strip())
                if data.get("type") == "delta":
                    full_response.append(data["delta"])
            except Exception:
                pass

        sources = [
            {
                "document_id": c["metadata"].get("document_id"),
                "filename": c["metadata"].get("filename"),
                "chunk_index": c["metadata"].get("chunk_index"),
            }
            for c in chunks
        ]
        await repo.add_message(
            conv_id,
            MessageRole.assistant,
            "".join(full_response),
            sources=sources,
        )

    return StreamingResponse(event_stream(), media_type="text/event-stream")
