from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.database import engine, Base
from app.models import models
from sqlalchemy import text

from app.routes.student_dashboard import router as student_dashboard_router
from app.routes.industry_dashboard import router as industry_dashboard_router
from app.routes.admin_dashboard import router as admin_dashboard_router
from app.routes.auth import router as auth_router

app = FastAPI(title="Internconnect Backend")

# serve uploaded files
Path("uploads").mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
def _startup_create_tables():
    # Avoid crashing import if DB is temporarily unavailable.
    try:
        Base.metadata.create_all(bind=engine)
        with engine.begin() as conn:
            conn.execute(text("""
                ALTER TABLE faculty_profiles
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
            """))
    except Exception:
        # DB might not be up yet; the app can still start and will fail on DB calls.
        pass

# ADD MIDDLEWARE FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  
)

# THEN include routers
app.include_router(auth_router)
app.include_router(student_dashboard_router)
app.include_router(industry_dashboard_router)
app.include_router(admin_dashboard_router)

@app.get("/")
def home():
    return {"message": "InternConnect Backend Running"}
