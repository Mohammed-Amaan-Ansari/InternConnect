from fastapi import APIRouter, Depends, HTTPException, Body, Form, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import csv
import io

from app.database import get_db
from app.models.models import (
    User,
    CompanyProfile,
    CompanyInternship,
    CompanyApplication,
    StudentProfile,
    LogbookEntry,
    Notification,
    LearningResource
)
from app.utils.files import save_upload, ALLOWED_GENERIC_MIME
from app.utils.jwt import get_current_user as jwt_get_current_user

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"]
)

def get_admin_user(user: User = Depends(jwt_get_current_user)) -> User:
    # Keep previous behavior: faculty acts as platform admin
    if not user or user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=401, detail="Unauthorized admin user")
    return user

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    total_students = db.query(func.count(StudentProfile.id)).scalar()
    total_companies = db.query(func.count(CompanyProfile.id)).scalar()
    active_internships = db.query(func.count(CompanyInternship.id)).filter(CompanyInternship.status == "Active").scalar()
    
    # Calculate placement rate (students with at least one Accepted application / total students)
    placed_students = db.query(CompanyApplication.student_id).filter(CompanyApplication.status == "Accepted").distinct().count()
    placement_rate = f"{int((placed_students / total_students) * 100) if total_students > 0 else 0}%"

    last_week = datetime.utcnow() - timedelta(days=7)
    recent_activities = []
    
    # Fake activities based on recent items
    recent_students = db.query(StudentProfile).order_by(StudentProfile.created_at.desc()).limit(2).all()
    for s in recent_students:
        recent_activities.append({"type": "student", "message": f"New student registered: {s.full_name}", "time": s.created_at.strftime("%Y-%m-%d %H:%M")})
        
    recent_companies = db.query(CompanyProfile).order_by(CompanyProfile.created_at.desc()).limit(2).all()
    for c in recent_companies:
        recent_activities.append({"type": "company", "message": f"New company registered: {c.company_name}", "time": c.created_at.strftime("%Y-%m-%d %H:%M")})
        
    return {
        "stats": {
            "totalStudents": total_students,
            "totalCompanies": total_companies,
            "activeInternships": active_internships,
            "placementRate": placement_rate,
        },
        "recentActivities": recent_activities[:5]
    }

@router.get("/analytics")
def get_admin_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    # Calculate real monthly data from applications and internships
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthlyData = []
    current_month = datetime.utcnow().month
    
    for i in range(max(1, current_month - 5), current_month + 1):
        studs = db.query(StudentProfile).filter(func.extract('month', StudentProfile.created_at) == i).count()
        ints = db.query(CompanyInternship).filter(func.extract('month', CompanyInternship.posted_at) == i).count()
        placements = db.query(CompanyApplication).filter(
            CompanyApplication.status == "Accepted",
            func.extract('month', CompanyApplication.applied_at) == i
        ).count()
        
        monthlyData.append({
            "month": months[i-1],
            "students": studs,
            "internships": ints,
            "placements": placements
        })

    # Department Data
    departments = db.query(StudentProfile.course, func.count(StudentProfile.id)).group_by(StudentProfile.course).all()
    colors = ['#1E40AF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    departmentData = []
    
    for idx, dept in enumerate(departments):
            if dept[0]:
                departmentData.append({
                    "name": dept[0],
                    "value": dept[1],
                    "color": colors[idx % len(colors)]
                })
    
    return {
        "monthlyData": monthlyData,
        "departmentData": departmentData
    }

@router.get("/approvals")
def get_pending_approvals(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    pending = db.query(CompanyInternship).filter(CompanyInternship.status == "Pending").all()
    result = []
    for p in pending:
        company_name = p.company_profile.company_name if p.company_profile else "Unknown"
        result.append({
            "id": p.id,
            "company": company_name,
            "role": p.role,
            "duration": getattr(p, "duration", "N/A"),
            "stipend": getattr(p, "stipend", "N/A"),
            "submittedDate": p.posted_at
        })
    return result

@router.post("/approvals/{internship_id}")
def update_internship_status(
    internship_id: int,
    status_data: dict, # {"status": "Active" | "Rejected" | "Pending", "feedback": "..."}
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    internship = db.query(CompanyInternship).filter(CompanyInternship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
        
    new_status = status_data.get("status")
    if new_status not in ["Active", "Rejected", "Pending"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    internship.status = new_status
    internship.admin_feedback = status_data.get("feedback")

    # notify company about decision
    if internship.company_profile:
        db.add(Notification(
            user_id=internship.company_profile.user_id,
            title="Internship review update",
            message=f"Your internship '{internship.role}' was marked as {new_status}.",
            type="Approval"
        ))

    db.commit()
    return {"message": f"Internship marked as {new_status}"}

@router.get("/companies/pending")
def get_pending_companies(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    pending = db.query(CompanyProfile).filter(CompanyProfile.is_approved == False).all()
    result = []
    for c in pending:
        user = db.query(User).filter(User.id == c.user_id).first()
        result.append({
            "id": c.id,
            "company_name": c.company_name,
            "email": user.email if user else "",
            "contact_person": c.contact_person,
            "designation": c.designation,
            "phone": c.phone,
            "address": c.address
        })
    return result

@router.post("/companies/{company_id}/approve")
def approve_company(
    company_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    company.is_approved = True

    # activate the underlying user account (only if email verified)
    user = db.query(User).filter(User.id == company.user_id).first()
    if user and user.is_email_verified:
        user.is_active = True

    db.add(Notification(
        user_id=company.user_id,
        title="Company approved",
        message="Your company account has been approved and is now active.",
        type="Approval"
    ))
    db.commit()
    return {"message": "Company approved successfully"}


@router.post("/companies/{company_id}/reject")
def reject_company(
    company_id: int,
    data: dict = Body(default_factory=dict),  # {"reason": "..."} - optional
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    user = db.query(User).filter(User.id == company.user_id).first()
    if user:
        user.is_active = False

    reason = data.get("reason", "Your company registration was rejected by admin.")
    db.add(Notification(
        user_id=company.user_id,
        title="Company registration rejected",
        message=reason,
        type="Approval"
    ))
    db.commit()
    return {"message": "Company rejected"}


@router.post("/companies/{company_id}/suspend")
def suspend_company(
    company_id: int,
    data: dict = Body(default_factory=dict),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    user = db.query(User).filter(User.id == company.user_id).first()
    if user:
        user.is_active = False
    company.is_approved = False  # Revoke approval so company cannot login
    reason = data.get("reason", "Your company account has been suspended.")
    db.add(Notification(
        user_id=company.user_id,
        title="Company suspended",
        message=reason,
        type="Alert"
    ))
    db.commit()
    return {"message": "Company suspended"}


@router.post("/companies/{company_id}/revoke")
def revoke_company(
    company_id: int,
    data: dict = Body(default_factory=dict),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Remove approved company - revokes approval and blocks login."""
    company = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company.is_approved = False
    user = db.query(User).filter(User.id == company.user_id).first()
    if user:
        user.is_active = False
    reason = data.get("reason", "Your company approval has been revoked.")
    db.add(Notification(
        user_id=company.user_id,
        title="Company approval revoked",
        message=reason,
        type="Alert"
    ))
    db.commit()
    return {"message": "Company approval revoked"}

@router.get("/companies")
def get_all_companies(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    companies = db.query(CompanyProfile).filter(CompanyProfile.is_approved == True).all()
    result = []
    for c in companies:
        user = db.query(User).filter(User.id == c.user_id).first()
        total_postings = db.query(CompanyInternship).filter(CompanyInternship.company_id == c.id).count()
        active_postings = db.query(CompanyInternship).filter(
            CompanyInternship.company_id == c.id, 
            CompanyInternship.status == "Active"
        ).count()
        result.append({
            "id": c.id,
            "company_name": c.company_name,
            "contact_person": c.contact_person,
            "email": user.email if user else "",
            "total_postings": total_postings,
            "active_postings": active_postings
        })
    return result

@router.get("/students")
def get_students_monitoring(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    students = db.query(StudentProfile).all()
    
    enrolls = 0
    ongoing = 0
    completed = 0
    
    student_list = []
    for s in students:
        apps = db.query(CompanyApplication).filter(CompanyApplication.student_id == s.id).all()
        
        status = "Available"
        interning_at = "Not placed"
        
        has_applied = len(apps) > 0
        is_accepted = any(a.status == "Accepted" for a in apps)
        
        if is_accepted:
            active_app = next(a for a in apps if a.status == "Accepted")
            if active_app.internship and active_app.internship.company_profile:
                interning_at = active_app.internship.company_profile.company_name
            status = "Ongoing"
            ongoing += 1
        elif has_applied:
            status = "Enrolled"
            enrolls += 1
        else:
            status = "Available"
            
        if has_applied:
            student_list.append({
                "id": s.id,
                "name": s.full_name,
                "course": getattr(s, "course", "Unknown"),
                "year": getattr(s, "year_of_study", getattr(s, "year", "Unknown")),
                "company": interning_at,
                "status": status,
                "progress": 75 if status == "Ongoing" else (25 if status == "Enrolled" else 0),
                "applications": [
                    {
                        "company": app.internship.company_profile.company_name,
                        "role": app.internship.role,
                        "status": app.status,
                        "applied_at": app.applied_at.isoformat() if app.applied_at else None
                    }
                    for app in apps if app.internship and app.internship.company_profile
                ]
            })
        
    return {
        "analytics": {
            "enrolled": enrolls,
            "ongoing": ongoing,
            "completed": completed
        },
        "students": student_list
    }

@router.get("/students/{student_id}/logbooks")
def get_student_specific_logbooks(
    student_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    entries = db.query(LogbookEntry).filter(LogbookEntry.student_id == student_id).order_by(LogbookEntry.week_number.asc()).all()
    result = []
    for e in entries:
        result.append({
            "id": e.id,
            "weekNumber": e.week_number,
            "taskDescription": e.task_description,
            "hoursWorked": e.hours_worked,
            "status": e.status,
            "supervisorComments": e.supervisor_comments,
            "fileUrl": e.file_url,
            "submittedAt": e.submitted_at
        })
    return result

from sqlalchemy import text
@router.get("/migrate")
def run_temp_migration(db: Session = Depends(get_db)):
    try:
        db.execute(text("ALTER TABLE company_profiles ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;"))
        db.commit()
    except Exception as e:
        return {"error": str(e)}
    return {"message": "Migration successful"}

@router.get("/notifications")
def get_admin_notifications(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    notifications = db.query(Notification).filter(Notification.user_id == admin.id).order_by(Notification.created_at.desc()).limit(50).all()
    result = []
    for n in notifications:
        result.append({
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "isRead": n.is_read,
            "time": n.created_at.strftime("%Y-%m-%d %H:%M"),
            "createdAt": n.created_at.isoformat() if n.created_at else None,
        })
    return result


@router.post("/notifications/{notification_id}/read")
def mark_admin_notification_read(
    notification_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    n = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == admin.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

@router.post("/send-announcement")
def send_global_announcement(
    data: dict, # title, message
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.role.in_(["student", "company"])).all()
    
    for u in users:
        notif = Notification(
            user_id=u.id,
            title=data.get("title", "Announcement"),
            message=data.get("message"),
            type="Alert"
        )
        db.add(notif)
        
    db.commit()
    return {"message": "Announcement sent to all users"}

@router.get("/logbooks/pending")
def get_pending_logbooks(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    entries = db.query(LogbookEntry).filter(LogbookEntry.status == "Submitted").all()
    result = []
    for e in entries:
        result.append({
            "id": e.id,
            "studentName": e.student.full_name,
            "studentCourse": e.student.course,
            "weekNumber": e.week_number,
            "taskDescription": e.task_description,
            "hoursWorked": e.hours_worked,
            "fileUrl": e.file_url,
            "submittedAt": e.submitted_at
        })
    return result

from app.schemas.logbook import LogbookApproval

@router.post("/logbooks/{logbook_id}/approve")
def approve_logbook(
    logbook_id: int,
    data: LogbookApproval,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    entry = db.query(LogbookEntry).filter(LogbookEntry.id == logbook_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Logbook entry not found")
        
    entry.status = data.status
    if data.supervisor_comments:
        entry.supervisor_comments = data.supervisor_comments
    
    notif = Notification(
        user_id=entry.student.user_id,
        title="Logbook Status Updated",
        message=f"Your logbook for Week {entry.week_number} has been {entry.status}.",
        type="General"
    )
    db.add(notif)
    db.commit()
    return {"message": f"Logbook marked as {entry.status}"}

@router.get("/settings")
def get_admin_settings(admin: User = Depends(get_admin_user)):
    return {
        "email_alerts": True,
        "auto_approve_students": False,
        "maintenance_mode": False
    }


@router.get("/reports/export")
def export_reports(
    report: str,  # placements | internships | companies
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    output = io.StringIO()
    writer = csv.writer(output)

    if report == "placements":
        writer.writerow(["student_id", "student_name", "company", "internship_role", "status", "applied_at"])
        rows = db.query(CompanyApplication).order_by(CompanyApplication.applied_at.desc()).all()
        for r in rows:
            writer.writerow([
                r.student_id,
                r.student.full_name if r.student else "",
                r.internship.company_profile.company_name if r.internship and r.internship.company_profile else "",
                r.internship.role if r.internship else "",
                r.status,
                r.applied_at.isoformat() if r.applied_at else "",
            ])
        filename = "placements.csv"
    elif report == "internships":
        writer.writerow(["internship_id", "company", "title", "status", "stipend", "deadline", "posted_at"])
        rows = db.query(CompanyInternship).order_by(CompanyInternship.posted_at.desc()).all()
        for r in rows:
            writer.writerow([
                r.id,
                r.company_profile.company_name if r.company_profile else "",
                r.role,
                r.status,
                r.stipend,
                r.deadline.isoformat() if r.deadline else "",
                r.posted_at.isoformat() if r.posted_at else "",
            ])
        filename = "internships.csv"
    elif report == "companies":
        writer.writerow(["company_id", "company_name", "is_approved", "created_at"])
        rows = db.query(CompanyProfile).order_by(CompanyProfile.created_at.desc()).all()
        for r in rows:
            writer.writerow([
                r.id,
                r.company_name,
                r.is_approved,
                r.created_at.isoformat() if r.created_at else "",
            ])
        filename = "companies.csv"
    else:
        raise HTTPException(status_code=400, detail="Unknown report")

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

@router.post("/learning-resources")
def upload_learning_resource(
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(None),
    url: str = Form(""),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    resource_url = url
    if file:
        path = save_upload(file, subdir="learning_resources", allowed_mime=ALLOWED_GENERIC_MIME)
        resource_url = "/" + path.replace("\\", "/").lstrip("/")
        
    if not resource_url:
        raise HTTPException(status_code=400, detail="Must provide either a file or a URL")
        
    resource = LearningResource(
        title=title,
        category=category,
        description=description,
        url=resource_url
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return {"message": "Resource added successfully", "id": resource.id}
