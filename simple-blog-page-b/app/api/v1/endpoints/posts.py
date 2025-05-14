from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from app.core.database import get_db
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
    Lấy tất cả bài viết blog đã xuất bản với các tùy chọn lọc,
    nếu vuln id=3 status=YES thì dùng raw SQL (có SQLi),
    ngược lại dùng filter an toàn.
    """
    query = db.query(Post)\
              .filter(Post.status == "published")\
              .order_by(asc(Post.created_at))

    # Áp dụng các bộ lọc cứng
    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            query = query.filter(Post.category_id == cat.id)

    if featured is not None:
        query = query.filter(Post.is_featured == featured)

    # Nhánh cho phần tìm kiếm
    if search:
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
    Lấy một bài viết cụ thể theo ID
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
    Thêm bình luận vào bài viết
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

# Các endpoint bài viết dành cho admin
@router.get("/admin/all", response_model=List[PostList])
def get_all_posts(
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint dành cho admin để lấy tất cả bài viết bao gồm cả bản nháp
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
    Tạo bài viết blog mới (chỉ dành cho admin)
    """
    # Kiểm tra xem danh mục có tồn tại không
    category = db.query(Category).filter(Category.id == post.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Tính thời gian đọc (phiên bản đơn giản)
    words = len(post.content.split())
    read_time = f"{max(1, round(words / 200))} min read"
    
    # Tạo đoạn trích nếu không được cung cấp
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
    Cập nhật bài viết blog (chỉ dành cho admin)
    """
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Cập nhật các trường của bài viết nếu được cung cấp
    update_data = post_update.model_dump(exclude_unset=True)
    
    # Nếu nội dung được cập nhật, tính lại thời gian đọc
    if "content" in update_data:
        words = len(update_data["content"].split())
        update_data["read_time"] = f"{max(1, round(words / 200))} min read"
        
        # Cập nhật đoạn trích nếu nội dung thay đổi và đoạn trích không được cung cấp
        if "excerpt" not in update_data:
            if len(update_data["content"]) > 200:
                update_data["excerpt"] = update_data["content"][:197] + "..."
            else:
                update_data["excerpt"] = update_data["content"]
    
    # Nếu category_id được cung cấp, kiểm tra xem nó có tồn tại không
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
    Xóa bài viết blog (chỉ dành cho admin)
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