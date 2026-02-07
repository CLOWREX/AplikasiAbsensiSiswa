from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import qrcode
import os
import json
from app.database import get_db
from app.utils.security import get_current_user
from app import models

router = APIRouter(prefix="/qr", tags=["QR"])

@router.post("/generate")
def generate_qr(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user or current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can generate QR")

    folder = "static/qr_codes"
    os.makedirs(folder, exist_ok=True)

    students = db.query(models.User)\
        .filter(models.User.role == "student")\
        .order_by(models.User.id.asc())\
        .limit(50).all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found")

    nis_list = [s.username for s in students]

    qr_payload = {
        "type": "attendance",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "nis": nis_list
    }

    qr_data = json.dumps(qr_payload)

    file_name = f"qr_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    path = os.path.join(folder, file_name)

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(path)

    qr_record = models.QRCode(
        file_path=f"/static/qr_codes/{file_name}"
    )
    db.add(qr_record)
    db.commit()
    db.refresh(qr_record)

    return {
        "qr_image_url": qr_record.file_path
    }
