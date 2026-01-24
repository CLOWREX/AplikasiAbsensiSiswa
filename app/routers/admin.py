from fastapi import APIRouter, Depends
from app.deps import admin_only
from app import models

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/dashboard")
def dashboard(admin: models.User = Depends(admin_only)):
    return {
        "message": "Selamat datang admin",
        "admin": admin.username
    }
