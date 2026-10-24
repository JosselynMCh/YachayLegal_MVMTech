from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.models import Base, LegalDocument, LegalChunk

import os

db_url = settings.DATABASE_URL
if os.environ.get("VERCEL") and db_url.startswith("sqlite:///./"):
    db_url = "sqlite:////tmp/yachay_legal.db"

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Sembrar corpus legal en SQLite si está vacío
    db = SessionLocal()
    try:
        from app.services.retrieval_service import OFFICIAL_LEGAL_CORPUS
        if db.query(LegalDocument).count() == 0:
            for item in OFFICIAL_LEGAL_CORPUS:
                doc = LegalDocument(
                    id=item["document_id"],
                    title=item["title"],
                    issuer=item["issuer"],
                    document_type="ley" if "ley" in item["document_id"] else "codigo",
                    publication_date=item.get("publication_date"),
                    official_url=item["official_url"],
                    verification_status="verified"
                )
                db.add(doc)
                db.flush()

                chunk = LegalChunk(
                    document_id=doc.id,
                    article_number=item["article"],
                    section_title=item.get("category", "general"),
                    content_es=item["content_es"],
                    content_qu=item.get("content_qu_chanka"),
                    dialect="quechua_chanka",
                    category=item.get("category"),
                    keywords=item.get("keywords")
                )
                db.add(chunk)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Nota en sembrado de BD: {e}")
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
