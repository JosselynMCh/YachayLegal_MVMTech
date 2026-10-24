import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    issuer = Column(String(100), nullable=False)  # e.g., "Congreso de la República", "MINJUSDH"
    document_type = Column(String(50), default="ley")  # ley, codigo, decreto
    publication_date = Column(String(20), nullable=True)
    version_checked_at = Column(String(20), nullable=True)
    official_url = Column(Text, nullable=False)
    verification_status = Column(String(50), default="verified")  # verified, pending, deprecated
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    chunks = relationship("LegalChunk", back_populates="document", cascade="all, delete-orphan")


class LegalChunk(Base):
    __tablename__ = "legal_chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(50), ForeignKey("legal_documents.id"), nullable=False)
    article_number = Column(String(50), nullable=False)  # e.g., "Artículo 71"
    section_title = Column(String(255), nullable=True)   # e.g., "Derechos del imputado"
    content_es = Column(Text, nullable=False)            # Texto oficial en español
    content_qu = Column(Text, nullable=True)             # Traducción validada al quechua
    dialect = Column(String(50), default="quechua_chanka")
    category = Column(String(100), nullable=True)        # "debido_proceso", "violencia_familiar"
    keywords = Column(Text, nullable=True)               # Términos clave para retrieval híbrido
    embedding_vector = Column(Text, nullable=True)       # Representación vectorial serializada

    document = relationship("LegalDocument", back_populates="chunks")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(64), primary_key=True, index=True)
    language = Column(String(10), default="qu")
    dialect = Column(String(50), default="quechua_chanka")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(String(64), ForeignKey("conversations.id"), nullable=False)
    sender = Column(String(20), nullable=False)  # "user", "assistant"
    content = Column(Text, nullable=False)
    language = Column(String(10), default="qu")
    status = Column(String(50), default="answered")  # answered, insufficient_evidence, requires_human_review
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class LanguageReview(Base):
    __tablename__ = "language_reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chunk_id = Column(Integer, nullable=True)
    original_text_es = Column(Text, nullable=False)
    translated_text_qu = Column(Text, nullable=False)
    dialect = Column(String(50), default="quechua_chanka")
    reviewer = Column(String(100), nullable=True)
    is_validated = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, default=datetime.datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, nullable=True)
    user_query = Column(Text, nullable=False)
    issue_type = Column(String(50), nullable=False)  # "bad_translation", "incorrect_law", "unclear_explanation"
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
