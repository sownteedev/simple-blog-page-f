from pydantic import BaseModel, EmailStr, HttpUrl
from datetime import datetime
from typing import Optional, List, Union
from pydantic import root_validator

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: str

    @root_validator(pre=True)
    def check_username_or_email(cls, values):
        username = values.get('username')
        email = values.get('email')
        if not username and not email:
            raise ValueError('Either username or email must be provided')
        return values

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int
    created_at: datetime
    is_admin: bool

    class Config:
        from_attributes = True

class User(UserInDB):
    pass

# Category schemas
class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class CategoryInDB(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class Category(CategoryInDB):
    pass

# Comment schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int
    author_id: Optional[int] = None

class CommentInDB(CommentBase):
    id: int
    created_at: datetime
    post_id: int
    author_id: int

    class Config:
        from_attributes = True

class Comment(CommentInDB):
    author: User

    class Config:
        from_attributes = True

# Post schemas
class PostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    read_time: Optional[str] = None
    is_featured: Optional[bool] = False

class PostCreate(PostBase):
    category_id: int
    status: Optional[str] = "draft"

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    read_time: Optional[str] = None

class PostInDB(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    status: str
    author_id: int
    category_id: int

    class Config:
        from_attributes = True

class PostList(BaseModel):
    id: int
    title: str
    excerpt: str
    image_url: Optional[str] = None
    created_at: datetime
    read_time: Optional[str] = None
    status: str
    is_featured: bool
    category: Category
    author: User

    class Config:
        from_attributes = True

class Post(PostInDB):
    category: Category
    author: User
    comments: Optional[List[Comment]] = []

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
# Message schemas
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    username: Optional[str] = "Anonymous"

class Message(MessageBase):
    id: int
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Response schemas
class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Union[dict, list]] = None
    
class VulnerabilityBase(BaseModel):
    name: str
    status: str

class VulnerabilityCreate(VulnerabilityBase):
    pass

class VulnerabilityUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None

class VulnerabilityInDB(VulnerabilityBase):
    id: int

    class Config:
        from_attributes = True

class VulnerabilityOut(VulnerabilityInDB):
    pass
