from sqlalchemy import Column, Integer, String, Date, DateTime, Time, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


# USERS TABLE
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# STUDENT PROFILE
class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    course = Column(String, nullable=False)
    year = Column(String, nullable=False)
    roll_number = Column(String, nullable=False)
    terms_accepted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # New fields
    resume_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    profile_visibility = Column(Boolean, default=True)

    applications = relationship("CompanyApplication", back_populates="student")
    logbooks = relationship("LogbookEntry", back_populates="student")
    learning_activities = relationship("UserLearningActivity", back_populates="student")
    user = relationship("User")


# =======================internship table=====================
class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    location = Column(String)
    duration = Column(String)
    stipend = Column(String)
    deadline = Column(Date)

# =======================Application table=====================
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id"), nullable=False)

    status = Column(String, default="Applied")
    applied_at = Column(DateTime, default=datetime.utcnow)

    internship = relationship("Internship")








# COMPANY PROFILE
# COMPANY PROFILE (linked to a user)
class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    company_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    contact_person = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    profile_visibility = Column(Boolean, default=True, nullable=False)

    # Relationships
    internships = relationship("CompanyInternship", back_populates="company_profile")
# =================posting by company==================
class CompanyInternship(Base):
    __tablename__ = "company_internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("company_profiles.id"), nullable=False)
    role = Column(String, nullable=False)
    department = Column(String, nullable=True)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    duration = Column(String)
    type = Column(String, nullable=True) # Full-time, Part-time
    openings = Column(Integer, default=1)
    location = Column(String)
    work_mode = Column(String, nullable=True) # On-site, Remote, Hybrid
    stipend = Column(String)
    deadline = Column(Date)
    eligibility = Column(String, nullable=True)
    skills = Column(String, nullable=True) # Text block or CSV
    min_cgpa = Column(String, nullable=True)
    preferred_year = Column(String, nullable=True)
    benefits = Column(String, nullable=True) # Text block or JSON string
    
    posted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String, default="Pending")  # Pending, Active, Closed, Archived, Rejected
    admin_feedback = Column(Text, nullable=True)

    company_profile = relationship("CompanyProfile", back_populates="internships")
    applications = relationship("CompanyApplication", back_populates="internship")
# ===================Application by students===========================
class CompanyApplication(Base):
    __tablename__ = "company_applications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    internship_id = Column(Integer, ForeignKey("company_internships.id"), nullable=False)

    applied_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Applied")
    company_feedback = Column(Text, nullable=True)

    student = relationship("StudentProfile", back_populates="applications")
    internship = relationship("CompanyInternship", back_populates="applications")



# =======================Interview Table======================
class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    
    # Reference to the application
    application_id = Column(Integer, ForeignKey("company_applications.id"), nullable=False)
    
    # Interview details
    interview_date = Column(Date, nullable=False)
    interview_time = Column(Time, nullable=False)
    mode = Column(String, default="Online")  # e.g., Online, Onsite, etc.
    location = Column(String, nullable=True)  # Optional if onsite
    
    status = Column(String, default="Scheduled")  # Scheduled, Completed, Cancelled
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    application = relationship("CompanyApplication", back_populates="interviews")

# Add back_populates in CompanyApplication
CompanyApplication.interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")





# FACULTY PROFILE
class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    faculty_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=True)
    entity_id = Column(Integer, nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")


# ======================= Learning Hub ======================
class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Video, Course, Article, Study Material
    url = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserLearningActivity(Base):
    __tablename__ = "user_learning_activities"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("learning_resources.id"), nullable=False)
    
    status = Column(String, default="Saved") # Saved, Completed
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="learning_activities")
    resource = relationship("LearningResource")

# ======================= Logbook ======================
class LogbookEntry(Base):
    __tablename__ = "logbook_entries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("company_applications.id"), nullable=True) # Optional, link to specific internship
    
    week_number = Column(Integer, nullable=False)
    task_description = Column(String, nullable=False)
    hours_worked = Column(Integer, nullable=False)
    file_url = Column(String, nullable=True) # Supporting file
    
    status = Column(String, default="Submitted") # Submitted, Approved, Rejected, Revision Requested
    supervisor_comments = Column(String, nullable=True)
    
    submitted_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="logbooks")
    application = relationship("CompanyApplication")

# ======================= Notifications ======================
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Can be student, company, or admins
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False) # e.g., Application, Interview, General, Alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

# ======================= Company Intern Feedback ======================
class InternFeedback(Base):
    __tablename__ = "intern_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("company_applications.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("company_profiles.id"), nullable=False)

    evaluation = Column(String, nullable=False) # Text feedback
    performance_rating = Column(Integer, nullable=False) # e.g., 1-5
    recommend_completion = Column(Boolean, default=True)
    
    submitted_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("CompanyApplication")
    company = relationship("CompanyProfile")

# ======================= Communication ======================
class CommunicationMessage(Base):
    __tablename__ = "communication_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    application_id = Column(Integer, ForeignKey("company_applications.id"), nullable=True) # Contextual to an application
    
    subject = Column(String, nullable=True)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    sent_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
