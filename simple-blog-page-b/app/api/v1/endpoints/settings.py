from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.blog import Vulnerability, User
from app.schemas.blog import VulnerabilityOut
from app.core.config import settings   
from pydantic import BaseModel
from pathlib import Path
from dotenv import load_dotenv, set_key

router = APIRouter()

@router.get(
    "/",
    response_model=List[VulnerabilityOut],
    summary="Lấy toàn bộ vulnerabilities"
)
def list_settings(db: Session = Depends(get_db)):
    return db.query(Vulnerability).all()

@router.get("/{vuln_id}", response_model=VulnerabilityOut)
def get_vulnerability(vuln_id: int, db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vulnerability not found")
    return vuln

class VulnerabilityBulkUpdate(BaseModel):
    id: int
    status: str 

@router.put(
    "/",
    response_model=List[VulnerabilityOut],
    summary="Bulk update toàn bộ vulnerabilities và tự động cập nhật SECRET_KEY"
)
def bulk_update_settings(
    updates: List[VulnerabilityBulkUpdate],
    db: Session = Depends(get_db)
):
    # 1. Bulk update như trước
    ids = [u.id for u in updates]
    vulns = db.query(Vulnerability).filter(Vulnerability.id.in_(ids)).all()
    vuln_map = {v.id: v for v in vulns}
    for u in updates:
        if u.id in vuln_map:
            vuln_map[u.id].status = u.status
    db.commit()

    # 2. Sau khi commit, kiểm tra status của id=2
    vuln2 = db.query(Vulnerability).filter(Vulnerability.id == 2).first()
    if vuln2 and vuln2.status.upper() == "YES":
        new_secret = "changeme"
    else:
        new_secret = "f81f9a4c3e8d7e5f18e3c98f17a98c3e5f6g7h8i9j0"

    # 3. Ghi vào file .env (đường dẫn tương đối ../../../../.env từ file này)
    env_path = Path(__file__).resolve().parents[4] / ".env"
    load_dotenv(env_path)                  # nạp .env
    set_key(str(env_path), "SECRET_KEY", new_secret)
    
    settings.SECRET_KEY = new_secret
    
    vuln4 = db.query(Vulnerability).get(4)
    if vuln4 and vuln4.status.upper() == "YES":
        new_admin_pwd = "$2b$12$TTjD2F3N51.2xN/m93y9VObams3.l5qv2BynK8rCwf3xkpFNb/kxK"
    else:
        new_admin_pwd = "$2a$10$erclurij.eXsYkf14ukCVexgar1nL/MeUTmrgbMP1VrQAUNMH5gH2"

    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin user not found")
    # Giả sử trường lưu password hash là `password`
    admin.hashed_password = new_admin_pwd
    db.add(admin)
    db.commit()

    # 4. Trả về danh sách đã cập nhật
    return db.query(Vulnerability).all()
