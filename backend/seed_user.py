import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from argon2 import PasswordHasher
import uuid

# Use postgres (Docker service name) for Docker environment
DATABASE_URL = "postgresql+asyncpg://finllm:finllm@postgres:5432/finllm"


async def main():
    engine = create_async_engine(DATABASE_URL)
    
    # Hash the password with argon2
    hasher = PasswordHasher()
    password = "demo123"
    hashed = hasher.hash(password)
    email = "demo@gmail.com"
    user_id = str(uuid.uuid4())
    
    async with engine.begin() as conn:
        # Delete existing user with same email
        await conn.execute(text("DELETE FROM users WHERE email = :email"), {"email": email})
        
        # Insert new user with argon2 hash
        await conn.execute(
            text("INSERT INTO users (id, email, hashed_password, is_active) VALUES (:id, :email, :hashed, TRUE)"),
            {"id": user_id, "email": email, "hashed": hashed}
        )
        print("✓ Demo user created successfully!")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
    
    await engine.dispose()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"✗ Failed: {e}")
        import sys
        sys.exit(1)
