from sqlalchemy.orm import Session
from app.models.blog import User, Category, Post, Vulnerability
from app.core.security import get_password_hash
from app.core.database import Base, engine

def init_db(db: Session) -> None:
    """Initialize the database with some sample data."""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create admin user if it doesn't exist
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("Admin user created")
    
    # Create default categories if they don't exist
    categories = {
        "education": "Education",
        "technology": "Technology",
        "community": "Community",
        "training": "Training"
    }
    
    for slug, name in categories.items():
        cat = db.query(Category).filter(Category.slug == slug).first()
        if not cat:
            cat = Category(name=name, slug=slug)
            db.add(cat)
            print(f"Category '{name}' created")
    
    db.commit()
    
    # Create sample posts if none exist
    if db.query(Post).count() == 0:
        education = db.query(Category).filter(Category.slug == "education").first()
        technology = db.query(Category).filter(Category.slug == "technology").first()
        training = db.query(Category).filter(Category.slug == "training").first()
        
        posts = []
        
        for post_data in posts:
            post = Post(**post_data)
            db.add(post)
            print(f"Post '{post_data['title']}' created")
        
        db.commit()
        print("Sample data initialized successfully")
        
    vulnerability_names = [
        "XSS", "CSRF", "SSRF",
        "SQLi", "SSTI", "XXE",
        "Broken Authentication", "Path Traversal", "JWT",
        "File upload", "OS Command Injection", "HTTP Smuggling",
        "Deserialization", "IDOR"
    ]

    for name in vulnerability_names:
        exists = db.query(Vulnerability).filter(Vulnerability.name == name).first()
        if not exists:
            vuln = Vulnerability(name=name)    # status sẽ mặc định là "No"
            db.add(vuln)
            print(f"Vulnerability '{name}' created")

    db.commit()
    print("Vulnerabilities initialized successfully")
    
    return None 