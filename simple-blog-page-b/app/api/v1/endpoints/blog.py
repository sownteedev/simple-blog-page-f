from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.blog import User, Post
from app.schemas.blog import UserCreate, User as UserSchema, PostCreate, Post as PostSchema
from passlib.context import CryptContext

router = APIRouter()

@router.post("/posts/", response_model=PostSchema)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    author = db.query(User).first()
    if not author:
        raise HTTPException(status_code=404, detail="No users found")
    
    db_post = Post(
        title=post.title,
        content=post.content,
        author_id=author.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/posts/", response_model=List[PostSchema])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts

@router.get("/posts/{post_id}", response_model=PostSchema)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post 