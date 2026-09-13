from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import SessionLocal
from models import User, Identity

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

test_users = [
    ("Sarah", "sarah", "secret123", "sunflower"),
    ("John", "john", "secret123", "coffee"),
    ("Diana", "diana", "secret123", "butterfly"),
    ("Peter", "peter", "secret123", "book"),
    ("Grace", "grace", "secret123", "camera"),
    ("James", "james", "secret123", "mountain"),
    ("Anna", "anna", "secret123", "star"),
    ("Michael", "michael", "secret123", "chocolate"),
]

db: Session = SessionLocal()

try:
    for name, username, password, identity_name in test_users:

        existing_user = db.query(User).filter(
            User.username == username
        ).first()

        if existing_user:
            print(f"{username} already exists. Skipping.")
            continue

        existing_identity = db.query(Identity).filter(
            Identity.name == identity_name
        ).first()

        if existing_identity:
            print(f"{identity_name} identity already exists. Skipping.")
            continue

        user = User(
            name=name,
            username=username,
            password_hash=pwd_context.hash(password),
            has_drawn=False
        )

        db.add(user)
        db.flush()

        identity = Identity(
            name=identity_name,
            user_id=user.id,
            is_picked=False
        )

        db.add(identity)

        print(f"Created {name} with identity {identity_name}")

    db.commit()

finally:
    db.close()
