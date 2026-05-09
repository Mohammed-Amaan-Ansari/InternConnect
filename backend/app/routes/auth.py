from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
import os
import secrets

from app.database import SessionLocal
from app.models.models import (
    User,
    StudentProfile,
    CompanyProfile,
    FacultyProfile,
    EmailVerificationToken,
    Notification,
    ActivityLog,
)
from app.schemas.student import StudentRegister
from app.schemas.company import CompanyRegister
from app.schemas.faculty import FacultyRegister
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token, get_current_user
from pydantic import BaseModel
# =============================
# Load Config from .env
# =============================
load_dotenv()  # load variables from .env file

EMAIL_VERIFICATION_EXPIRE_HOURS = int(os.getenv("EMAIL_VERIFICATION_EXPIRE_HOURS", 48))
BOOTSTRAP_ADMIN_SECRET = os.getenv("BOOTSTRAP_ADMIN_SECRET")

# =============================
# Router & Security
# =============================
router = APIRouter(prefix="/auth", tags=["auth"])

# =============================
# Utility Functions
# =============================
def require_role(role: str):
    def role_checker(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return role_checker

# =============================
# Database Dependency
# =============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _create_email_verification(db: Session, user: User) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=EMAIL_VERIFICATION_EXPIRE_HOURS)
    db.add(EmailVerificationToken(user_id=user.id, token=token, expires_at=expires_at))
    db.commit()
    return token

# =============================
# Registration Endpoints
# =============================
@router.post("/register/student")
@router.post("/student/register")
def register_student(data: StudentRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role="student",
        is_email_verified=True,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    student_profile = StudentProfile(
        user_id=new_user.id,
        full_name=data.fullName,
        phone=data.phone,
        course=data.course,
        year=data.year,
        roll_number=data.rollNumber,
        terms_accepted=bool(data.acceptTerms),
        resume_url=data.resumeUrl if data.resumeUrl is not None else None,
        portfolio_url=data.portfolioUrl if data.portfolioUrl is not None else None,
        skills=",".join(data.skills) if data.skills else None,
        profile_visibility=bool(data.profileVisibility) if data.profileVisibility is not None else True,
    )
    db.add(student_profile)
    db.commit()

    try:
        token = _create_email_verification(db, new_user)
        db.add(ActivityLog(user_id=new_user.id, action="student_registered", entity_type="user", entity_id=new_user.id))
        db.commit()
    except Exception:
        token = None

    return {
        "message": "Student registered successfully",
        "verificationToken": token,
        "redirectTo": "/auth/student/login"
    }

@router.post("/register/company")
def register_company(data: CompanyRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Prevent duplicate company name (case-insensitive)
    existing = db.query(CompanyProfile).filter(
        func.lower(CompanyProfile.company_name) == data.companyName.strip().lower()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A company with this name is already registered")

    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role="company",
        is_email_verified=True,
        is_active=True,
    )
    db.add(new_user)
    db.flush()
    db.refresh(new_user)

    company_profile = CompanyProfile(
        user_id=new_user.id,
        company_name=data.companyName,
        phone=data.phone,
        address=data.address,
        contact_person=data.contactPerson,
        designation=data.designation
    )
    db.add(company_profile)
    db.commit()

    token = _create_email_verification(db, new_user)

    # notify admins for approval
    admins = db.query(User).filter(User.role.in_(["admin", "faculty"])).all()
    for a in admins:
        db.add(Notification(
            user_id=a.id,
            title="New company registration",
            message=f"{company_profile.company_name} registered and is pending approval.",
            type="Approval",
        ))
    db.add(ActivityLog(user_id=new_user.id, action="company_registered", entity_type="company_profile", entity_id=company_profile.id))
    db.commit()

    return {
        "message": "Company registered. Verify email, then wait for admin approval to activate the account.",
        "verificationToken": token,
    }

@router.post("/register/faculty")
def register_faculty(data: FacultyRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role="faculty",
        is_email_verified=True,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    faculty_profile = FacultyProfile(
        user_id=new_user.id,
        faculty_name=data.facultyName,
        phone=data.phone,
        address=data.address
    )
    db.add(faculty_profile)
    db.commit()
    return {"message": "Faculty registered successfully"}


@router.post("/bootstrap-admin")
def bootstrap_admin(
    data: FacultyRegister,
    secret: str,
    db: Session = Depends(get_db),
):
    if not BOOTSTRAP_ADMIN_SECRET or secret != BOOTSTRAP_ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Bootstrap disabled or invalid secret")
    return register_faculty(data, db)


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    record = db.query(EmailVerificationToken).filter(EmailVerificationToken.token == token).first()
    if not record:
        raise HTTPException(status_code=400, detail="Invalid token")
    if record.used_at is not None:
        raise HTTPException(status_code=400, detail="Token already used")
    if record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_email_verified = True
    record.used_at = datetime.utcnow()

    # Students become active immediately after verification.
    # Companies become active only after admin approval.
    if user.role == "student":
        user.is_active = True

    db.add(ActivityLog(user_id=user.id, action="email_verified", entity_type="user", entity_id=user.id))
    db.commit()

    return {"message": "Email verified successfully"}

# =============================
# Login Endpoint
# =============================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Company: require admin approval to login (original behavior)
    if user.role == "company":
        company = db.query(CompanyProfile).filter(CompanyProfile.user_id == user.id).first()
        if company and not company.is_approved:
            raise HTTPException(status_code=403, detail="Company account pending admin approval")

    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login-json")
def login_json(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.role == "company":
        company = db.query(CompanyProfile).filter(CompanyProfile.user_id == user.id).first()
        if company and not company.is_approved:
            raise HTTPException(status_code=403, detail="Company account pending admin approval")
    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }

# =============================
# Role-Based Dashboards
# =============================
@router.get("/student/dashboard")
def student_dashboard(user=Depends(require_role("student"))):
    return {"message": "Welcome Student Dashboard"}

@router.get("/company/dashboard")
def company_dashboard(user=Depends(require_role("company"))):
    return {"message": "Welcome Company Dashboard"}

@router.get("/faculty/dashboard")
def faculty_dashboard(user=Depends(require_role("faculty"))):
    return {"message": "Welcome Faculty Dashboard"}
