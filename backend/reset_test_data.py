"""Manually reset the Secret Santa database for development/testing."""

from database import SessionLocal
from models import Assignment, Identity, PasswordResetToken, User


db = SessionLocal()
try:
    db.query(PasswordResetToken).delete(synchronize_session=False)
    db.query(Assignment).delete(synchronize_session=False)
    db.query(Identity).delete(synchronize_session=False)
    deleted_users = db.query(User).delete(synchronize_session=False)
    db.commit()
    print(f"Deleted {deleted_users} users and all related test data.")
except Exception:
    db.rollback()
    raise
finally:
    db.close()