from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import date, datetime
from typing import Optional
import os
import json
import urllib.request
import urllib.parse
from dotenv import load_dotenv

from app.database import SessionLocal
from app.models.models import (
    CompanyApplication, CompanyInternship, StudentProfile,
    LearningResource, UserLearningActivity, LogbookEntry, Notification,
    CommunicationMessage
)
from app.utils.jwt import get_current_user
from app.schemas.student import StudentProfileUpdate
from app.schemas.learning import UserLearningActivityUpdate
from app.schemas.logbook import LogbookEntryCreate, LogbookEntryUpdate
from app.utils.files import save_upload, ALLOWED_RESUME_MIME, ALLOWED_GENERIC_MIME

router = APIRouter(prefix="/student/dashboard", tags=["Student Dashboard"])

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===========dashboard api======================
@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    applications_count = db.query(CompanyApplication).filter(CompanyApplication.student_id == student.id).count()
    shortlisted_count = db.query(CompanyApplication).filter(CompanyApplication.student_id == student.id, CompanyApplication.status == "Shortlisted").count()
    in_progress_count = db.query(CompanyApplication).filter(CompanyApplication.student_id == student.id, CompanyApplication.status == "Selected").count()

    return {
        "applications": applications_count,
        "shortlisted": shortlisted_count,
        "inProgress": in_progress_count,
        "profileViews": 12 # mock
    }

@router.get("/recent-applications")
def get_recent_applications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    recent = db.query(CompanyApplication)\
        .filter(CompanyApplication.student_id == student.id)\
        .order_by(CompanyApplication.applied_at.desc())\
        .limit(5)\
        .all()

    result = []
    for app in recent:
        result.append({
            "id": app.id,
            "company": app.internship.company_profile.company_name,
            "role": app.internship.role,
            "status": app.status,
            "appliedDate": app.applied_at
        })

    return result

# ==============================recommended api===========================
@router.get("/recommended-internships")
def get_recommended_internships(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Simple logic: return latest active internships
    internships = db.query(CompanyInternship)\
        .filter(CompanyInternship.status == "Active")\
        .order_by(CompanyInternship.posted_at.desc())\
        .limit(3)\
        .all()

    result = []
    for internship in internships:
        result.append({
            "id": internship.id,
            "company": internship.company_profile.company_name if internship.company_profile else "Unknown",
            "role": internship.role,
            "location": internship.location,
            "duration": internship.duration,
            "stipend": internship.stipend,
            "match": 90 # placeholder match score
        })

    return result


# ==============================deadline api===========================
@router.get("/deadlines")
def get_deadlines(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    today = date.today()

    internships = db.query(CompanyInternship)\
        .filter(CompanyInternship.deadline >= today, CompanyInternship.status == "Active")\
        .order_by(CompanyInternship.deadline.asc())\
        .limit(5)\
        .all()

    result = []
    for internship in internships:
        days_left = (internship.deadline - today).days

        result.append({
            "id": internship.id,
            "company": internship.company_profile.company_name if internship.company_profile else "Unknown",
            "role": internship.role,
            "deadline": internship.deadline,
            "daysLeft": days_left
        })

    return result

# ==============================internship search api===========================
@router.get("/internships")
def search_internships(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    company: Optional[str] = Query(default=None),
    domain: Optional[str] = Query(default=None),
    duration: Optional[str] = Query(default=None),
    location: Optional[str] = Query(default=None),
    stipend: Optional[str] = Query(default=None),
    type: Optional[str] = Query(default=None),
    keyword: Optional[str] = Query(default=None),
    sort: str = Query(default="newest")  # newest, stipend, relevance
):
    # For InternshipSearch.tsx
    q = db.query(CompanyInternship).filter(CompanyInternship.status == "Active")

    if company:
        q = q.filter(CompanyInternship.company_profile.has(company_name=company))
    if domain:
        q = q.filter(CompanyInternship.category.ilike(f"%{domain}%"))
    if duration:
        dur_conditions = [CompanyInternship.duration.ilike(f"%{d}%") for d in duration.split(',')]
        q = q.filter(or_(*dur_conditions))
    if location:
        loc_conditions = [CompanyInternship.location.ilike(f"%{l}%") for l in location.split(',')]
        q = q.filter(or_(*loc_conditions))
    if stipend:
        stipend_conditions = [CompanyInternship.stipend.ilike(f"%{s}%") for s in stipend.split(',')]
        q = q.filter(or_(*stipend_conditions))
    if type:
        type_conditions = [CompanyInternship.type.ilike(f"%{t}%") for t in type.split(',')]
        q = q.filter(or_(*type_conditions))
    if keyword:
        like = f"%{keyword}%"
        q = q.filter(or_(
            CompanyInternship.role.ilike(like),
            CompanyInternship.description.ilike(like),
            CompanyInternship.skills.ilike(like),
            CompanyInternship.category.ilike(like),
        ))

    if sort == "stipend":
        q = q.order_by(CompanyInternship.stipend.desc())
    else:
        q = q.order_by(CompanyInternship.posted_at.desc())

    internships = q.all()
    
    result = []
    for i in internships:
        skills = i.skills.split(",") if getattr(i, 'skills', None) else []
        result.append({
            "id": i.id,
            "title": i.role,
            "company": i.company_profile.company_name if getattr(i, 'company_profile', None) else "Unknown",
            "location": i.location,
            "type": getattr(i, 'type', 'Full-time'),
            "duration": i.duration,
            "stipend": i.stipend,
            "skills": skills,
            "postedDate": i.posted_at,
            "match": 85 # Dummy value for now
        })
    return result

# ==============================internship details api===========================
@router.get("/internships/{internship_id}")
def get_internship_details(
    internship_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    i = db.query(CompanyInternship).filter(CompanyInternship.id == internship_id).first()
    if not i:
        raise HTTPException(status_code=404, detail="Internship not found")
        
    skills = i.skills.split(",") if getattr(i, 'skills', None) else []
    
    return {
        "title": i.role,
        "company": i.company_profile.company_name if getattr(i, 'company_profile', None) else "Unknown",
        "company_user_id": i.company_profile.user_id if getattr(i, 'company_profile', None) else None,
        "location": i.location,
        "type": getattr(i, 'type', 'Full-time'),
        "duration": i.duration,
        "stipend": i.stipend,
        "openings": getattr(i, 'openings', 1),
        "applicants": len(i.applications) if i.applications else 0,
        "postedDate": i.posted_at,
        "deadline": i.deadline,
        "skills": skills,
        "description": getattr(i, 'description', ''),
        "responsibilities": ["Work closely with the team", "Deliver assignments on time"], # Temporary placeholder list
        "requirements": [getattr(i, 'eligibility', '')],
        "benefits": [getattr(i, 'benefits', '')]
    }

# ==============================apply for internship api===========================
@router.post("/applications/{internship_id}")
def apply_for_internship(
    internship_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Profile completeness check (minimum needed for applications)
    # Temporarily disabled to allow testing without needing a resume upload
    # if not student.resume_url or not student.skills:
    #     raise HTTPException(status_code=400, detail="Complete your profile (resume + skills) before applying")

    internship = db.query(CompanyInternship).filter(
        CompanyInternship.id == internship_id, 
        CompanyInternship.status == "Active"
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found or not active")

    # check if already applied
    existing_app = db.query(CompanyApplication).filter(
        CompanyApplication.student_id == student.id,
        CompanyApplication.internship_id == internship.id
    ).first()
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this internship")

    new_app = CompanyApplication(
        student_id=student.id,
        internship_id=internship.id,
        status="Applied"
    )
    db.add(new_app)

    # notify company
    db.add(Notification(
        user_id=internship.company_profile.user_id,
        title="New application received",
        message=f"{student.full_name} applied for {internship.role}.",
        type="Application"
    ))
    db.commit()

    return {"message": "Successfully applied for internship!"}

# ==============================get all applications api===========================
@router.get("/applications")
def get_all_applications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    apps = db.query(CompanyApplication)\
        .filter(CompanyApplication.student_id == student.id)\
        .order_by(CompanyApplication.applied_at.desc())\
        .all()

    result = []
    for app in apps:
        result.append({
            "id": app.id,
            "internshipId": app.internship.id if app.internship else None,
            "companyId": app.internship.company_profile.user_id if (app.internship and app.internship.company_profile) else None,
            "company": app.internship.company_profile.company_name if app.internship and app.internship.company_profile else "Unknown",
            "role": app.internship.role if app.internship else "Unknown",
            "location": app.internship.location if app.internship else "Unknown",
            "status": app.status,
            "appliedDate": app.applied_at
        })

    return result

# ==============================withdraw application api===========================
@router.delete("/applications/{application_id}")
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    app = db.query(CompanyApplication).filter(CompanyApplication.id == application_id, CompanyApplication.student_id == student.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if app.status in ["Selected", "Rejected"]:
        raise HTTPException(status_code=400, detail="Cannot withdraw at this stage")

    app.status = "Withdrawn"
    db.commit()
    return {"message": "Application withdrawn successfully"}


@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return {
        "fullName": student.full_name,
        "email": current_user.email,
        "phone": student.phone,
        "course": student.course,
        "year": student.year,
        "rollNumber": student.roll_number,
        "resumeUrl": student.resume_url,
        "portfolioUrl": student.portfolio_url,
        "skills": student.skills.split(",") if student.skills else [],
        "profileVisibility": student.profile_visibility,
    }


@router.post("/profile/resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    path = save_upload(file, subdir=f"resumes/{student.id}", allowed_mime=ALLOWED_RESUME_MIME)
    student.resume_url = "/" + path.replace("\\", "/").lstrip("/")
    db.commit()
    return {"resumeUrl": student.resume_url}

# ==============================profile update api===========================
@router.put("/profile")
def update_profile(
    data: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    if data.fullName is not None: student.full_name = data.fullName
    if data.phone is not None: student.phone = data.phone
    if data.course is not None: student.course = data.course
    if data.year is not None: student.year = data.year
    if data.resumeUrl is not None: student.resume_url = data.resumeUrl
    if data.portfolioUrl is not None: student.portfolio_url = data.portfolioUrl
    if data.skills is not None: student.skills = ",".join(data.skills)
    if data.profileVisibility is not None: student.profile_visibility = data.profileVisibility

    db.commit()
    db.refresh(student)
    return {"message": "Profile updated successfully"}

# ==============================learning hub api===========================
@router.get("/learning-resources")
def get_learning_resources(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    resources = db.query(LearningResource).all()
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    activities = {a.resource_id: a.status for a in db.query(UserLearningActivity).filter(UserLearningActivity.student_id == student.id).all()}
    
    result = []
    for r in resources:
        result.append({
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "url": r.url,
            "description": r.description,
            "status": activities.get(r.id, "Unread")
        })
    return result

def _youtube_search(query: str, max_results: int = 10):
    if not YOUTUBE_API_KEY:
        return None
    base = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "type": "video",
        "maxResults": str(max_results),
        "q": query,
        "key": YOUTUBE_API_KEY,
    }
    url = f"{base}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        items = []
        for it in data.get("items", []):
            vid = it["id"]["videoId"]
            sn = it["snippet"]
            items.append({
                "title": sn.get("title", ""),
                "category": "Video",
                "url": f"https://www.youtube.com/watch?v={vid}",
                "description": sn.get("description", ""),
            })
        return items
    except Exception:
        return []

@router.get("/learning-resources/search")
def search_learning_resources(
    query: str,
    max_results: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    yt = _youtube_search(query, max_results)
    if yt is None:
        # Fallback to detailed mock search if API key not present
        return [
            {
                "id": f"mock_{i}",
                "title": f"Learn {query} from Scratch (Part {i+1})",
                "category": "Video",
                "url": f"https://www.youtube.com/watch?v=mock_{query}_{i}",
                "description": f"A comprehensive guide to {query}. Essential tutorial for beginners.",
                "status": "Unread"
            } for i in range(min(max_results, 5))
        ]
    return yt

@router.post("/learning-resources/import")
def import_learning_resources(
    query: str,
    max_results: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    yt = _youtube_search(query, max_results)
    if yt is None:
        raise HTTPException(status_code=400, detail="YouTube API key not configured")
    count = 0
    for item in yt:
        exists = db.query(LearningResource).filter(LearningResource.url == item["url"]).first()
        if exists:
            continue
        db.add(LearningResource(
            title=item["title"],
            category=item["category"],
            url=item["url"],
            description=item["description"],
            created_at=datetime.utcnow()
        ))
        count += 1
    db.commit()
    return {"message": f"Imported {count} resources"}

@router.put("/learning-resources/{resource_id}/status")
def update_learning_status(
    resource_id: int,
    data: UserLearningActivityUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    activity = db.query(UserLearningActivity).filter(
        UserLearningActivity.student_id == student.id,
        UserLearningActivity.resource_id == resource_id
    ).first()
    
    if not activity:
        activity = UserLearningActivity(student_id=student.id, resource_id=resource_id, status=data.status)
        db.add(activity)
    else:
        activity.status = data.status
        
    db.commit()
    return {"message": f"Resource marked as {data.status}"}

# ==============================logbook api===========================
@router.post("/logbook")
def submit_logbook(
    data: LogbookEntryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    entry = LogbookEntry(
        student_id=student.id,
        application_id=data.application_id,
        week_number=data.week_number,
        task_description=data.task_description,
        hours_worked=data.hours_worked,
        file_url=data.file_url,
        status="Draft"
    )
    db.add(entry)
    db.commit()
    return {"message": "Logbook entry saved as draft", "id": entry.id}


@router.put("/logbook/{logbook_id}")
def update_logbook_draft(
    logbook_id: int,
    data: LogbookEntryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    entry = db.query(LogbookEntry).filter(LogbookEntry.id == logbook_id, LogbookEntry.student_id == student.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Logbook entry not found")
    if entry.status != "Draft":
        raise HTTPException(status_code=400, detail="Only drafts can be edited")

    if data.task_description is not None:
        entry.task_description = data.task_description
    if data.hours_worked is not None:
        entry.hours_worked = data.hours_worked
    if data.file_url is not None:
        entry.file_url = data.file_url

    db.commit()
    return {"message": "Draft updated"}


@router.post("/logbook/{logbook_id}/submit")
def submit_logbook_final(
    logbook_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    entry = db.query(LogbookEntry).filter(LogbookEntry.id == logbook_id, LogbookEntry.student_id == student.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Logbook entry not found")
    if entry.status != "Draft":
        raise HTTPException(status_code=400, detail="Only drafts can be submitted")

    entry.status = "Submitted"
    db.commit()
    return {"message": "Logbook entry submitted for review"}


@router.post("/logbook/{logbook_id}/upload")
def upload_logbook_file(
    logbook_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    entry = db.query(LogbookEntry).filter(LogbookEntry.id == logbook_id, LogbookEntry.student_id == student.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Logbook entry not found")
    if entry.status != "Draft":
        raise HTTPException(status_code=400, detail="Can only upload files to drafts")

    path = save_upload(file, subdir=f"logbooks/{student.id}/{entry.id}", allowed_mime=ALLOWED_GENERIC_MIME)
    entry.file_url = "/" + path.replace("\\", "/").lstrip("/")
    db.commit()
    return {"fileUrl": entry.file_url}

@router.get("/logbook")
def get_logbooks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    entries = db.query(LogbookEntry).filter(LogbookEntry.student_id == student.id).order_by(LogbookEntry.week_number.desc()).all()
    
    result = []
    for e in entries:
        result.append({
            "id": e.id,
            "applicationId": e.application_id,
            "weekNumber": e.week_number,
            "taskDescription": e.task_description,
            "hoursWorked": e.hours_worked,
            "fileUrl": e.file_url,
            "status": e.status,
            "supervisorComments": e.supervisor_comments,
            "submittedAt": e.submitted_at
        })
    return result

# ==============================notifications api===========================
@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    result = []
    for n in notifications:
        result.append({
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "isRead": n.is_read,
            "createdAt": n.created_at
        })
    return result


@router.post("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    n = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

from app.schemas.communication import CommunicationMessageCreate

@router.post("/communication/send")
def send_message(
    data: CommunicationMessageCreate,
    current_user = Depends(get_current_user),
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
    
    notif = Notification(
        user_id=data.receiver_id,
        title=data.subject or "New Message",
        message="You have received a new message from a student.",
        type="General"
    )
    db.add(notif)
    db.commit()
    return {"message": "Message sent"}

@router.get("/communication/inbox")
def get_inbox(
    current_user = Depends(get_current_user),
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

