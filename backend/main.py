import os

from routes.draw import router as draw_router
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dependencies import get_current_user
from models import User
from database import engine, Base
import models

from routes.auth import router as auth_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Family Secret Santa API",
    description="Backend for our family Secret Santa website",
    version="1.0.0"
)

allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")
allowed_origins = [origin.strip().rstrip("/") for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(draw_router)

@app.get("/")
def home():
    return {
        "message": "🎅 Welcome to the Family Secret Santa!",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
@app.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "username": current_user.username
    }
