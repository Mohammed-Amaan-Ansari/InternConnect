import os
import sys

# Add the backend directory to sys.path so 'app' can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from sqlalchemy import text
from app.database import engine

def apply_migrations():
    # Run each statement in its own transaction so a single failure
    # doesn't abort the entire migration run.
    commands = [
            # users
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();",

            # student_profiles
            "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS resume_url VARCHAR;",
            "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR;",
            "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS skills VARCHAR;",
            "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS profile_visibility BOOLEAN DEFAULT TRUE;",
            "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();",

            # company_profiles
            "ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();",
            "ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS description TEXT;",
            "ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS logo_url VARCHAR;",
            "ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS profile_visibility BOOLEAN DEFAULT TRUE;",

            # company_internships
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS admin_feedback TEXT;",
            "ALTER TABLE company_internships ALTER COLUMN status SET DEFAULT 'Pending';",

            # company_applications
            "ALTER TABLE company_applications ADD COLUMN IF NOT EXISTS company_feedback TEXT;",

            # interviews: ensure fk points to company_applications
            "ALTER TABLE interviews DROP CONSTRAINT IF EXISTS interviews_application_id_fkey;",
            "ALTER TABLE interviews ADD CONSTRAINT interviews_application_id_fkey FOREIGN KEY (application_id) REFERENCES company_applications(id) ON DELETE CASCADE;",

            # email verification tokens
            """CREATE TABLE IF NOT EXISTS email_verification_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR NOT NULL UNIQUE,
                expires_at TIMESTAMP NOT NULL,
                used_at TIMESTAMP NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );""",
            "CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);",
            "CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);",

            # activity logs
            """CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                action VARCHAR NOT NULL,
                entity_type VARCHAR NULL,
                entity_id INTEGER NULL,
                metadata_json TEXT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );""",
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);",
    ]

    with engine.connect() as conn:
        for cmd in commands:
            try:
                with conn.begin():
                    conn.execute(text(cmd))
                print(f"Executed: {cmd}")
            except Exception as e:
                msg = str(e).lower()
                if "already exists" in msg or "duplicate column" in msg:
                    print(f"Already exists: {cmd}")
                else:
                    print(f"Error executing {cmd}: {e}")

    print("Migration run complete.")

if __name__ == "__main__":
    apply_migrations()
