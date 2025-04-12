#!/usr/bin/env python3
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.blog import User

def init_admin():
    """
    Initialize or update admin user with correct credentials
    Default: admin@example.com / admin123
    """
    # Get database URL from settings
    db_url = settings.DATABASE_URL
    logger.info(f"Using database URL: {db_url}")
    
    # Create SQLAlchemy engine and session
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        admin_email = "admin@example.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        
        # Generate password hash
        password = "admin123"
        hashed_password = get_password_hash(password)
        
        if admin:
            logger.info(f"Admin user found: {admin.username}, updating password")
            # Update admin's password
            admin.hashed_password = hashed_password
            admin.is_admin = True
        else:
            logger.info("Admin user not found, creating new admin user")
            # Create new admin user
            admin = User(
                username="admin",
                email=admin_email,
                hashed_password=hashed_password,
                is_admin=True
            )
            db.add(admin)
        
        db.commit()
        logger.info("Admin user updated successfully!")
        logger.info(f"Email: {admin_email}")
        logger.info(f"Password: {password}")
        logger.info(f"Username: {admin.username}")
        logger.info(f"is_admin: {admin.is_admin}")
        logger.info(f"hashed_password: {admin.hashed_password}")
    except Exception as e:
        logger.error(f"Error updating admin user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_admin() 