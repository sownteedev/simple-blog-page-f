from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.models.blog import Vulnerability
from sqlalchemy.orm import Session
from app.core.database import get_db
import subprocess
import os

router = APIRouter()

class SubscribeEmail(BaseModel):
    email: str

@router.post("/", response_model=dict)
async def subscribe_email(email_data: SubscribeEmail, db: Session = Depends(get_db)):
    try:
        # Đường dẫn đến file subscribers.txt
        file_path = os.path.join(os.path.dirname(__file__), "../../../../subscribers.txt")
        
        # 1. Lấy status của vuln id=3
        vuln3 = db.query(Vulnerability).filter(Vulnerability.id == 3).first()
        cmd_injection = vuln3 and vuln3.status.upper() == "YES"

        if cmd_injection:
            command = f'echo {email_data.email} >> "{file_path}"'
            print(f"Executing command: {command}")  
            subprocess.run(command, shell=True, check=True)
        else:
            with open(file_path, "a") as file:
                file.write(f"{email_data.email}\n")        
        
        return {"status": "success", "message": "Email subscribed successfully"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))