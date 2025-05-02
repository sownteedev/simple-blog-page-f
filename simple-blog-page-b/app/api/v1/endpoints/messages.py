from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.models.blog import Message, User
from app.schemas.blog import MessageCreate, Message as MessageSchema, StandardResponse

router = APIRouter()

@router.post("/", response_model=StandardResponse)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    """
    Send a message to administrators - không cần xác thực
    """
    # Lấy username từ request body
    username = message.username if hasattr(message, 'username') else "Anonymous"
    
    db_message = Message(
        content=message.content,
        username=username
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return {
        "success": True,
        "message": "Message sent successfully",
        "data": None
    }

@router.get("/", response_model=List[MessageSchema])
def get_all_messages(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages - admin only
    """
    messages = db.query(Message).order_by(desc(Message.created_at)).offset(skip).limit(limit).all()
    return messages

@router.delete("/{message_id}", response_model=StandardResponse)
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a message (admin only)
    """
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    
    return {
        "success": True,
        "message": "Message deleted",
        "data": None
    } 