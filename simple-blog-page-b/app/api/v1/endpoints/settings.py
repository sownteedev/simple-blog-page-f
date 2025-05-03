from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.blog import Vulnerability
from app.schemas.blog import VulnerabilityOut
from pydantic import BaseModel

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
    summary="Bulk update toàn bộ vulnerabilities"
)
def bulk_update_settings(
    updates: List[VulnerabilityBulkUpdate],
    db: Session = Depends(get_db)
):
    ids = [u.id for u in updates]
    vulns = db.query(Vulnerability).filter(Vulnerability.id.in_(ids)).all()
    vuln_map = {v.id: v for v in vulns}

    for u in updates:
        if u.id in vuln_map:
            vuln_map[u.id].status = u.status

    db.commit()
    return db.query(Vulnerability).all()
