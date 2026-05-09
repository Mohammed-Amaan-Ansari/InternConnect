from sqlalchemy import text
from app.database import engine

def alter_table():
    with engine.connect() as conn:
        commands = [
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS department VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS category VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS description VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS type VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS openings INTEGER DEFAULT 1;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS work_mode VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS eligibility VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS skills VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS min_cgpa VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS preferred_year VARCHAR;",
            "ALTER TABLE company_internships ADD COLUMN IF NOT EXISTS benefits VARCHAR;"
        ]
        
        for cmd in commands:
            try:
                conn.execute(text(cmd))
                print(f"Executed: {cmd}")
            except Exception as e:
                print(f"Error executing {cmd}: {e}")
                
        conn.commit()
        print("Successfully updated company_internships table.")

if __name__ == "__main__":
    alter_table()
