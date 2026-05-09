import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import text
from app.database import engine

def apply_migration():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE company_profiles ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;"))
            conn.commit()
            print("Migration successful: Added is_approved column to company_profiles.")
        except Exception as e:
            print(f"Migration error (might already exist): {e}")

if __name__ == "__main__":
    apply_migration()
