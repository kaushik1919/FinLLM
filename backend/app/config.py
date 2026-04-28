from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "FinLLM Assistant"
    debug: bool = False
    environment: str = "development"

    database_url: str
    redis_url: str = "redis://localhost:6379/0"

    chroma_host: str = "localhost"
    chroma_port: int = 8001
    chroma_collection: str = "finllm_documents"

    openai_api_key: str
    anthropic_api_key: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiry_minutes: int = 60

    storage_path: str = "./storage"
    max_upload_size_mb: int = 50

    chunk_size_tokens: int = 512
    chunk_overlap_tokens: int = 64

    retrieval_top_k: int = 20
    rerank_top_k: int = 5


settings = Settings()
