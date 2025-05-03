from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, posts, categories, blog, messages, settings

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(posts.router, prefix="/posts", tags=["Posts"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
api_router.include_router(settings.router, prefix="/settings", tags=["Vulnerabilities"])