from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.blog import Category, User
from app.schemas.blog import CategoryCreate, Category as CategorySchema, StandardResponse

router = APIRouter()

@router.get("/", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    """
    Get all categories
    """
    categories = db.query(Category).all()
    return categories

@router.post("/", response_model=CategorySchema)
def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Create a new category (admin only)
    """
    # Check if category exists
    db_category = db.query(Category).filter(
        (Category.name == category.name) | (Category.slug == category.slug)
    ).first()
    
    if db_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name or slug already exists"
        )
    
    # Create new category
    db_category = Category(
        name=category.name,
        slug=category.slug
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.put("/{category_id}", response_model=CategorySchema)
def update_category(
    category_id: int,
    category: CategoryCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a category (admin only)
    """
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check for conflicts
    conflict = db.query(Category).filter(
        (Category.id != category_id) &
        ((Category.name == category.name) | (Category.slug == category.slug))
    ).first()
    
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name or slug already exists"
        )
    
    db_category.name = category.name
    db_category.slug = category.slug
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}", response_model=StandardResponse)
def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a category (admin only)
    """
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if any posts are using this category
    posts_count = db.query(db_category.posts).count()
    if posts_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category: {posts_count} posts are using it"
        )
    
    db.delete(db_category)
    db.commit()
    
    return {
        "success": True,
        "message": f"Category '{db_category.name}' has been deleted",
        "data": None
    } 