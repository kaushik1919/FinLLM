"""Seed script to create dummy user for testing."""

import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.user import User
from app.core.security import hash_password
from app.config import settings
from app.database import Base


async def seed_users():
    """Create dummy user for testing."""
    engine = create_async_engine(settings.database_url, echo=False)
    
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False, autocommit=False
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as session:
        # Check if user already exists
        from sqlalchemy import select
        result = await session.execute(select(User).where(User.email == "demo@gmail.com"))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print("✓ Demo user already exists: demo@gmail.com / demo123")
            await session.close()
            await engine.dispose()
            return
        
        # Create demo user
        demo_user = User(
            email="demo@gmail.com",
            hashed_password=hash_password("demo123"),
            is_active=True
        )
        session.add(demo_user)
        await session.commit()
        
        print("✓ Created demo user:")
        print(f"  Email: demo@gmail.com")
        print(f"  Password: demo123")
        print(f"  ID: {demo_user.id}")
    
    await engine.dispose()


if __name__ == "__main__":
    try:
        asyncio.run(seed_users())
        print("\n✓ Database seeding completed successfully!")
    except Exception as e:
        print(f"\n✗ Seeding failed: {e}", file=sys.stderr)
        sys.exit(1)
