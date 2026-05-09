# app/routes/industry_dashboard.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.models import (
    User,
    CompanyProfile,
    CompanyInternship,
    CompanyApplication,
    StudentProfile,
    Interview,
    InternFeedback,
    CommunicationMessage,
    Notification
)

from app.utils.jwt import get_current_user as jwt_get_current_user
from app.utils.files import save_upload, ALLOWED_GENERIC_MIME

router = APIRouter(
    prefix="/industry/dashboard",
    tags=["Industry Dashboard"]
)


# -------------------------------------------------------
# REAL JWT verification
# -------------------------------------------------------
def get_current_user(
    user: User = Depends(jwt_get_current_user)
) -> User:

    if not user or user.role != "company":
        raise HTTPException(status_code=401, detail="Unauthorized company user")

    return user


# -------------------------------------------------------
# Dashboard Stats
# -------------------------------------------------------
@router.get("/stats")
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    company = db.query(CompanyProfile).filter(
        CompanyProfile.user_id == current_user.id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    # total postings
    total_postings = db.query(func.count(CompanyInternship.id)).filter(
        CompanyInternship.company_id == company.id
    ).scalar()

    # active postings
    active_postings = db.query(func.count(CompanyInternship.id)).filter(
        CompanyInternship.company_id == company.id,
        CompanyInternship.status == "Active"
    ).scalar()

    # total applicants
    total_applicants = db.query(func.count(CompanyApplication.id))\
        .join(CompanyInternship)\
        .filter(
            CompanyInternship.company_id == company.id
        ).scalar()

    # active interns (Selected)
    active_interns = db.query(func.count(CompanyApplication.id))\
        .join(CompanyInternship)\
        .filter(
            CompanyInternship.company_id == company.id,
            CompanyApplication.status == "Selected"
        ).scalar()

    # new postings in last 7 days
    last_week = datetime.utcnow() - timedelta(days=7)

    new_postings = db.query(func.count(CompanyInternship.id)).filter(
        CompanyInternship.company_id == company.id,
        CompanyInternship.posted_at >= last_week
    ).scalar()

    # new applicants in last 7 days
    new_applicants = db.query(func.count(CompanyApplication.id))\
        .join(CompanyInternship)\
        .filter(
            CompanyInternship.company_id == company.id,
            CompanyApplication.applied_at >= last_week
        ).scalar()

    # completing soon (not tracked yet in schema)
    completing_soon = 0

    conversion_rate = 0
    if total_applicants > 0:
        conversion_rate = int((active_interns / total_applicants) * 100)

    profile_views = 2345 # Placeholder since not in schema

    return {
        "totalPostings": total_postings,
        "activePostings": active_postings,
        "totalApplicants": total_applicants,
        "activeInterns": active_interns,
        "newPostings": new_postings,
        "newApplicants": new_applicants,
        "completingSoon": completing_soon,
        "conversionRate": conversion_rate,
        "profileViews": profile_views
    }

@router.put("/profile")
def update_company_profile(
    data: dict, # company_name, phone, address, contact_person, designation
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    if "company_name" in data: company.company_name = data["company_name"]
    if "phone" in data: company.phone = data["phone"]
    if "address" in data: company.address = data["address"]
    if "contact_person" in data: company.contact_person = data["contact_person"]
    if "designation" in data: company.designation = data["designation"]
    if "description" in data: company.description = data["description"]
    if "profile_visibility" in data: company.profile_visibility = bool(data["profile_visibility"])

    db.commit()
    db.refresh(company)
    return {"message": "Company profile updated successfully"}


@router.post("/profile/logo")
def upload_company_logo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    path = save_upload(file, subdir=f"company-logos/{company.id}", allowed_mime=ALLOWED_GENERIC_MIME)
    company.logo_url = "/" + path.replace("\\", "/").lstrip("/")
    db.commit()
    return {"logoUrl": company.logo_url}


# -------------------------------------------------------
# Recent Applications
# -------------------------------------------------------
@router.get("/recent-applications")
def get_recent_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    company = db.query(CompanyProfile).filter(
        CompanyProfile.user_id == current_user.id
    ).first()

    applications = db.query(CompanyApplication)\
        .join(CompanyInternship)\
        .join(StudentProfile)\
        .filter(
            CompanyInternship.company_id == company.id
        )\
        .order_by(CompanyApplication.applied_at.desc())\
        .limit(5)\
        .all()

    result = []

    for app in applications:

        result.append({
            "id": app.id,
            "studentName": app.student.full_name,
            "internshipRole": app.internship.role,
            "course": app.student.course,
            "appliedDate": app.applied_at,
            "status": app.status
        })

    return result


from app.schemas.company import InternshipCreate

# -------------------------------------------------------
# Company Internships
# -------------------------------------------------------
@router.post("/internships")
def post_company_internship(
    data: InternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    company = db.query(CompanyProfile).filter(
        CompanyProfile.user_id == current_user.id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    new_internship = CompanyInternship(
        company_id=company.id,
        role=data.title,
        department=data.department,
        category=data.category,
        description=data.description,
        type=data.type,
        openings=data.openings,
        duration=data.duration,
        location=data.location,
        work_mode=data.workMode,
        stipend=data.stipend,
        deadline=data.deadline,
        eligibility=data.eligibility,
        skills=",".join(data.skills) if data.skills else "",
        min_cgpa=data.minCgpa,
        preferred_year=data.preferredYear,
        benefits=data.benefits,
        status="Active",
        posted_at=datetime.utcnow()
    )

    db.add(new_internship)
    # notify admins for approval
    admins = db.query(User).filter(User.role == "admin").all()
    for a in admins:
        db.add(Notification(
            user_id=a.id,
            title="New internship posting",
            message=f"{company.company_name} posted {new_internship.role}. Pending approval.",
            type="Approval",
        ))

    db.commit()
    db.refresh(new_internship)

    return {"message": "Internship submitted for admin approval", "id": new_internship.id}

@router.get("/internships")
def get_company_internships(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    company = db.query(CompanyProfile).filter(
        CompanyProfile.user_id == current_user.id
    ).first()

    internships = db.query(CompanyInternship).filter(
        CompanyInternship.company_id == company.id
    ).order_by(CompanyInternship.posted_at.desc()).all()

    result = []
    for internship in internships:
        application_count = db.query(func.count(CompanyApplication.id)).filter(
            CompanyApplication.internship_id == internship.id
        ).scalar()

        result.append({
            "id": internship.id,
            "title": internship.role,
            "status": internship.status,
            "posted": internship.posted_at,
            "applications": application_count,
            "views": 0 # placeholder
        })

    return result

@router.put("/internships/{internship_id}/status")
def change_internship_status(
    internship_id: int,
    data: dict, # status: "Closed" or "Active"
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    internship = db.query(CompanyInternship).filter(CompanyInternship.id == internship_id, CompanyInternship.company_id == company.id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
        
    internship.status = data.get("status", "Closed")
    db.commit()
    return {"message": f"Internship status changed to {internship.status}"}

# -------------------------------------------------------
# Candidates Review
# -------------------------------------------------------
@router.get("/candidates")
def get_candidates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = None,
    min_cgpa: float = None
):
    company = db.query(CompanyProfile).filter(
        CompanyProfile.user_id == current_user.id
    ).first()

    q = db.query(CompanyApplication)\
        .join(CompanyInternship)\
        .join(StudentProfile)\
        .filter(CompanyInternship.company_id == company.id)

    if role and role != "All Roles":
        q = q.filter(CompanyInternship.role.ilike(f"%{role}%"))
    
    if min_cgpa is not None:
        # Assuming CGPA is stored as string in course/some field or not strictly enforced. 
        # But we added it in schema, let's cast if we had it, but mostly we check mock or handle appropriately.
        # Since StudentProfile currently has no CGPA field, we mock logic or skip db filter if field doesn't exist
        # Wait, StudentProfile does not have cgpa in models.py, it's mocked in frontend.
        pass

    applications = q.order_by(CompanyApplication.applied_at.desc()).all()

    result = []
    for app in applications:
        student = app.student
        result.append({
            "id": app.id,
            "student_user_id": student.user_id if student else None,
            "name": student.full_name if student else "Unknown",
            "college": getattr(student, 'college', 'Unknown'),
            "course": getattr(student, 'course', 'Unknown'),
            "cgpa": getattr(student, 'cgpa', 0.0),
            "resumeUrl": getattr(student, 'resume_url', None),
            "email": student.user.email if student and student.user else "Unknown",
            "phone": getattr(student, 'phone', 'Unknown'),
            "skills": getattr(student, 'skills', '').split(",") if getattr(student, 'skills', '') else [],
            "match": 85, # placeholder
            "role": app.internship.role,
            "status": app.status
        })

    return result

@router.put("/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    status_data: dict,  # {"status": "Reviewed" | "Shortlisted" | "Selected" | "Rejected"}
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(CompanyApplication).filter(CompanyApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Verify app belongs to this company
    if app.internship.company_profile.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    new_status = status_data.get("status")
    if new_status not in ["Reviewed", "Shortlisted", "Selected", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    app.status = new_status
    db.commit()
    
    # Send Notification to student
    notif = Notification(
        user_id=app.student.user_id,
        title="Application Update",
        message=f"Your application for {app.internship.role} at {app.internship.company_profile.company_name} was marked as {app.status}.",
        type="Application"
    )
    db.add(notif)
    db.commit()
    
    return {"message": f"Application status updated to {app.status}"}


# -------------------------------------------------------
# Upcoming Interviews
# -------------------------------------------------------
@router.get("/interviews")
def get_upcoming_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    company = db.query(CompanyProfile).filter(
        CompanyProfile.user_id == current_user.id
    ).first()

    interviews = db.query(Interview)\
        .join(CompanyApplication)\
        .join(CompanyInternship)\
        .join(StudentProfile)\
        .filter(
            CompanyInternship.company_id == company.id,
            Interview.status == "Scheduled"
        )\
        .order_by(Interview.interview_date.asc())\
        .limit(5)\
        .all()

    result = []

    for interview in interviews:

        result.append({
            "interviewId": interview.id,
            "studentName": interview.application.student.full_name,
            "internshipRole": interview.application.internship.role,
            "scheduledDate": interview.interview_date,
            "status": interview.status
        })

    return result

@router.post("/interviews")
def schedule_interview(
    data: dict, # application_id, date, time, mode, location
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(CompanyApplication).filter(CompanyApplication.id == data["application_id"]).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    interview = Interview(
        application_id=app.id,
        interview_date=datetime.strptime(data["date"], "%Y-%m-%d").date() if isinstance(data["date"], str) else data["date"],
        interview_time=datetime.strptime(data["time"], "%H:%M").time() if isinstance(data["time"], str) else data["time"],
        mode=data.get("mode", "Online"),
        location=data.get("location"),
        status="Scheduled"
    )
    db.add(interview)
    
    # Interview scheduling does not change application status flow; keep current status.
    
    # Notify student
    notif = Notification(
        user_id=app.student.user_id,
        title="Interview Scheduled",
        message=f"An interview for {app.internship.role} has been scheduled for {interview.interview_date} at {interview.interview_time}.",
        type="Interview"
    )
    db.add(notif)
    db.commit()
    return {"message": "Interview scheduled successfully"}

from app.schemas.communication import InternFeedbackCreate, CommunicationMessageCreate

@router.post("/feedback")
def submit_intern_feedback(
    application_id: int,
    data: InternFeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(CompanyApplication).filter(CompanyApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    feedback = InternFeedback(
        application_id=app.id,
        company_id=app.internship.company_id,
        evaluation=data.evaluation,
        performance_rating=data.performance_rating,
        recommend_completion=data.recommend_completion
    )
    db.add(feedback)
    db.commit()
    return {"message": "Feedback submitted successfully"}

@router.post("/communication/send")
def send_message(
    data: CommunicationMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msg = CommunicationMessage(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        application_id=data.application_id,
        subject=data.subject,
        message=data.message
    )
    db.add(msg)
    
    # add notification
    notif = Notification(
        user_id=data.receiver_id,
        title=data.subject or "New Message",
        message="You have received a new message from a company.",
        type="General"
    )
    db.add(notif)
    db.commit()
    return {"message": "Message sent"}


@router.get("/communication/inbox")
def get_inbox(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msgs = db.query(CommunicationMessage).filter(
        (CommunicationMessage.receiver_id == current_user.id) | 
        (CommunicationMessage.sender_id == current_user.id)
    ).order_by(CommunicationMessage.sent_at.desc()).limit(100).all()
    
    result = []
    for m in msgs:
        # Resolve names
        s_name = m.sender.email
        r_name = m.receiver.email
        
        # Check profiles for sender
        s_profile = db.query(StudentProfile).filter(StudentProfile.user_id == m.sender_id).first()
        if s_profile:
            s_name = s_profile.full_name
        else:
            c_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == m.sender_id).first()
            if c_profile:
                s_name = c_profile.company_name
                
        # Check profiles for receiver
        r_profile = db.query(StudentProfile).filter(StudentProfile.user_id == m.receiver_id).first()
        if r_profile:
            r_name = r_profile.full_name
        else:
            rc_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == m.receiver_id).first()
            if rc_profile:
                r_name = rc_profile.company_name

        result.append({
            "id": m.id,
            "senderId": m.sender_id,
            "senderName": s_name,
            "receiverId": m.receiver_id,
            "receiverName": r_name,
            "subject": m.subject,
            "message": m.message,
            "applicationId": m.application_id,
            "isRead": m.is_read,
            "sentAt": m.sent_at,
        })
    return result
