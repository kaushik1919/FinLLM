import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.user import User
from app.core.security import hash_password
from app.database import Base

# Use postgres (Docker service name) instead of localhost
DATABASE_URL = "postgresql+asyncpg://finllm:finllm@postgres:5432/finllm"


async def main():
    # Create engine
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    # Create session factory
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    try:
        # Check if user exists
        async with async_session() as session:
            result = await session.execute(
                select(User).where(User.email == "demo@gmail.com")
            )
            existing = result.scalar_one_or_none()
            
            if existing:
                print("✓ Demo user already exists!")
                print(f"  Email: demo@gmail.com")
                print(f"  Password: demo123")
                return
            
            # Create new user
            user = User(
                email="demo@gmail.com",
                hashed_password=hash_password("demo123"),
                is_active=True
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            
            print("✓ Demo user created successfully!")
            print(f"  Email: demo@gmail.com")
            print(f"  Password: demo123")
            print(f"  ID: {user.id}")
            
    except Exception as e:
        print(f"✗ Failed to create user: {e}")
        raise
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
