from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, time, date
import uuid
import qrcode
import os

from app.database import get_db
from app.models import QrCode, User
from app.dependencies import get_current_user

router = APIRouter(prefix="/qr", tags=["QR"])

@router.post("/generate")
def generate_qr(
    kelas_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔐 Role check
    if current_user.role not in ["admin", "guru"]:
        raise HTTPException(status_code=403, detail="Tidak punya akses")

    now = datetime.now().time()

    # ⏰ Batas waktu QR
    if not (time(5, 0) <= now <= time(7, 30)):
        raise HTTPException(
            status_code=400,
            detail="QR hanya bisa dibuat jam 05.00 - 07.30"
        )

    # 🔑 Token unik
    token = str(uuid.uuid4())

    qr = QrCode(
        token=token,
        kelas_id=kelas_id,
        tanggal=date.today(),
        aktif_dari=time(5, 0),
        aktif_sampai=time(7, 30),
        created_by=current_user.id
    )

    db.add(qr)
    db.commit()
    db.refresh(qr)

    # 📦 Generate file QR
    folder = "qr_codes"
    os.makedirs(folder, exist_ok=True)

    img = qrcode.make(token)
    path = f"{folder}/qr_kelas_{kelas_id}.png"
    img.save(path)

    return {
        "message": "QR berhasil dibuat",
        "token": token,
        "file": path
    }
