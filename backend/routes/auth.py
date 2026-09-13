import os
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import get_db
from models import User, Identity, PasswordResetToken
from schemas import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from auth_utils import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    # Check participant limit
    user_count = db.query(User).count()

    if user_count >= 11:
        raise HTTPException(
            status_code=400,
            detail="Registration is full. Only 11 participants are allowed."
        )

    # Check username
    existing_user = db.query(User).filter(
        User.username == data.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username is already taken."
        )

    # Check secret identity
    existing_identity = db.query(Identity).filter(
        Identity.name == data.identity_name
    ).first()

    if existing_identity:
        raise HTTPException(
            status_code=400,
            detail="That secret identity has already been taken."
        )

    # Hash password
    hashed_password = pwd_context.hash(data.password)

    # Create user
    new_user = User(
        name=data.name,
        username=data.username,
        password_hash=hashed_password,
        has_drawn=False
    )

    db.add(new_user)
    db.flush()

    # Create secret identity
    new_identity = Identity(
        name=data.identity_name,
       
        user_id=new_user.id
    )

    db.add(new_identity)

    db.commit()
    db.refresh(new_user)

    return {
        "message": 

"Registration successful!",
        "user_id": new_user.id,
        "name": new_user.name,
        "username": new_user.username,
        "identity": new_identity.name
    }
@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):



    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    if not pwd_context.verify(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )
    access_token = create_access_token(user.id)

    return {
    "message": "🎉 Login successful!",
    "access_token": access_token,
    "token_type": "bearer",
    "user_id": user.id,
    "name": user.name
}
@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    # Invalidate any previous unused reset tokens
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False
    ).update({
        PasswordResetToken.used: True
    })

    token = secrets.token_urlsafe(32)

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(minutes=15),
        used=False
    )

    db.add(reset_token)
    db.commit()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

    return {
        "message": "Password reset request created.",
        "reset_link": f"{frontend_url}/reset-password?token={token}"
    }


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == data.token,
        PasswordResetToken.used == False
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=400,
            detail="Invalid or already used reset token."
        )

    if reset_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="This reset token has expired."
        )

    user = db.query(User).filter(
        User.id == reset_token.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    user.password_hash = pwd_context.hash(
        data.new_password
    )

    reset_token.used = True

    db.commit()

    return {
        "message": "Password reset successful. You can now log in."
    }
