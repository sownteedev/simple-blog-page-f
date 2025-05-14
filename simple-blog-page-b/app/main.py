from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, get_db
from app.api.v1.api import api_router
from app.core.init_db import init_db

app = FastAPI(
    title=settings.APP_NAME,
    description="A simple blog API built with FastAPI",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Cấu hình middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Máy chủ phát triển frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tạo bảng nếu chúng chưa tồn tại
Base.metadata.create_all(bind=engine)

# Khởi tạo cơ sở dữ liệu với dữ liệu mẫu
@app.on_event("startup")
async def startup_db_client():
    db = next(get_db())
    init_db(db)

# Bao gồm router API
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the Blog API - Frontend should be running on port 3000"} 