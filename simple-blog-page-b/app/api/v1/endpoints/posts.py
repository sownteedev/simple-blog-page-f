from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from sqlalchemy import text
from app.core.database import get_db
from app.models.blog import Vulnerability
from app.core.security import get_current_user, get_current_admin_user
from app.models.blog import Post, User, Category, Comment
from app.schemas.blog import (
    PostCreate, PostUpdate, Post as PostSchema, 
    PostList, StandardResponse, CommentCreate,
    Comment as CommentSchema
)

router = APIRouter()

@router.get("/", response_model=List[PostList])
def get_posts(
    skip: int = 0, 
    limit: int = 10, 
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all published blog posts with filtering options,
    nếu vuln id=3 status=YES thì dùng raw SQL (có SQLi),
    ngược lại dùng filter an toàn.
    """
    query = db.query(Post)\
              .filter(Post.status == "published")\
              .order_by(asc(Post.created_at))

    # Apply filters cứng
    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            query = query.filter(Post.category_id == cat.id)

    if featured is not None:
        query = query.filter(Post.is_featured == featured)

    # Branch cho phần search
    if search:
        # 1. Lấy status của vuln id=3
        vuln3 = db.query(Vulnerability).filter(Vulnerability.id == 3).first()
        use_sql_injection = vuln3 and vuln3.status.upper() == "YES"

        # if use_sql_injection:
        #     print("Using raw SQL for search")
        #     raw_sql = (
        #       f"(posts.title LIKE '{search}') OR "
        #       f"(posts.content LIKE '{search}') OR "
        #       f"(posts.excerpt LIKE '{search}')"
        #     )
        #     query = query.filter(text(raw_sql))
        # else:
        #     print("Using safe filter for search")
        #     query = query.filter(
        #       (Post.title.ilike(f"%{search}%")) |
        #       (Post.content.ilike(f"%{search}%")) |
        #       (Post.excerpt.ilike(f"%{search}%"))
        #     )
        query = query.filter(
              (Post.title.ilike(f"%{search}%")) |
              (Post.content.ilike(f"%{search}%")) |
              (Post.excerpt.ilike(f"%{search}%"))
            )

    total = query.count()
    posts = query.offset(skip).limit(limit).all()
    return posts

@router.get("/{post_id}", response_model=PostSchema)
def get_post(post_id: int, db: Session = Depends(get_db)):
    """
    Get a specific post by ID
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post or post.status != "published":
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/{post_id}/comments", response_model=CommentSchema)
def create_comment(
    post_id: int,
    comment: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a comment to a post
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = Comment(
        content=comment.content,
        post_id=post_id,
        author_id=current_user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

# Admin post endpoints
@router.get("/admin/all", response_model=List[PostList])
def get_all_posts(
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to get all posts including drafts
    """
    query = db.query(Post).order_by(desc(Post.created_at))
    
    if status:
        query = query.filter(Post.status == status)
    
    posts = query.offset(skip).limit(limit).all()
    return posts

@router.post("/", response_model=PostSchema)
def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Create a new blog post (admin only)
    """
    # Check if category exists
    category = db.query(Category).filter(Category.id == post.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Calculate read time (simplified version)
    words = len(post.content.split())
    read_time = f"{max(1, round(words / 200))} min read"
    
    # Create excerpt if not provided
    excerpt = post.excerpt
    if not excerpt and len(post.content) > 200:
        excerpt = post.content[:197] + "..."
    elif not excerpt:
        excerpt = post.content
    
    db_post = Post(
        title=post.title,
        content=post.content,
        excerpt=excerpt,
        image_url=post.image_url,
        read_time=read_time,
        status=post.status,
        is_featured=post.is_featured,
        author_id=current_user.id,
        category_id=post.category_id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.put("/{post_id}", response_model=PostSchema)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a blog post (admin only)
    """
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Update the post fields if provided
    update_data = post_update.model_dump(exclude_unset=True)
    
    # If content is updated, recalculate read time
    if "content" in update_data:
        words = len(update_data["content"].split())
        update_data["read_time"] = f"{max(1, round(words / 200))} min read"
        
        # Update excerpt if content changed and excerpt not provided
        if "excerpt" not in update_data:
            if len(update_data["content"]) > 200:
                update_data["excerpt"] = update_data["content"][:197] + "..."
            else:
                update_data["excerpt"] = update_data["content"]
    
    # If category_id is provided, check if it exists
    if "category_id" in update_data:
        category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in update_data.items():
        setattr(db_post, key, value)
    
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/{post_id}", response_model=StandardResponse)
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a blog post (admin only)
    """
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(db_post)
    db.commit()
    
    return {
        "success": True,
        "message": f"Post '{db_post.title}' has been deleted",
        "data": None
    } 