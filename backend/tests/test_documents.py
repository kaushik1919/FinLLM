import io

import pytest
from httpx import AsyncClient


async def _get_token(client: AsyncClient, email: str = "doc@example.com") -> str:
    reg = await client.post("/api/v1/auth/register", json={"email": email, "password": "pass123"})
    return reg.json()["access_token"]


@pytest.mark.asyncio
async def test_list_documents_empty(client: AsyncClient):
    token = await _get_token(client)
    response = await client.get("/api/v1/documents", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_upload_txt_document(client: AsyncClient, monkeypatch):
    async def mock_embed(texts):
        return [[0.0] * 10 for _ in texts]

    monkeypatch.setattr("app.services.embedding_service.embed_texts", mock_embed)

    class MockCollection:
        def upsert(self, **kwargs):
            pass

    class MockChroma:
        def get_or_create_collection(self, name):
            return MockCollection()

    monkeypatch.setattr("app.main.app.state", type("State", (), {"chroma": MockChroma(), "redis": None})())

    token = await _get_token(client, "uploader@example.com")
    content = b"Revenue for Q1 2024 was $10M"
    response = await client.post(
        "/api/v1/documents/upload",
        files={"file": ("report.txt", io.BytesIO(content), "text/plain")},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code in (200, 202)
    data = response.json()
    assert data["filename"] == "report.txt"
    assert data["file_size"] == len(content)


@pytest.mark.asyncio
async def test_get_document_not_found(client: AsyncClient):
    token = await _get_token(client, "notfound@example.com")
    import uuid
    response = await client.get(
        f"/api/v1/documents/{uuid.uuid4()}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
