from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.config import DATABASE_URL  # ✅ Import from config.py

# ✅ Ensure SQLite uses the correct connection args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# ✅ Create database engine
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# ✅ Create session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# ✅ Define base model for ORM
Base = declarative_base()

# ✅ Import models AFTER defining Base to ensure tables are detected
from backend.app import models

# ✅ Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
