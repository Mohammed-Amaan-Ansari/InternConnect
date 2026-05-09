from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Use .env DATABASE_URL or your existing PostgreSQL config (port 5434)
DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql://postgres:Ansari111@localhost:5434/internconnect"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
