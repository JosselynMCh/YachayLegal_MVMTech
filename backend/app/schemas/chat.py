from pydantic import BaseModel, Field
from typing import List, Optional

class TranslationInfo(BaseModel):
    language: str = "qu"
    dialect: Optional[str] = None
    branch: Optional[str] = None
    text: Optional[str] = None
    validated: bool = False
    notes: Optional[str] = None

class SourceCitation(BaseModel):
    document_id: str
    title: str
    issuer: str
    article: str
    article_content: Optional[str] = None
    official_url: str
    publication_date: Optional[str] = None

class ReferralService(BaseModel):
    name: str
    phone: str
    description: str
    official_url: str
    is_urgent: bool = False

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Consulta formulada en quechua o español")
    input_language: str = Field(default="auto", description="Idioma detectado o seleccionado: auto, qu, es")
    dialect: Optional[str] = Field(default=None, description="Variante del quechua (si input_language es 'qu'). En 'es' debe ser None.")
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    status: str = Field(..., description="answered, insufficient_evidence, requires_legal_counsel, off_topic")
    input_language: str
    detected_dialect: Optional[str] = None
    normalized_query_es: Optional[str] = None
    answer: str
    translation: TranslationInfo
    sources: List[SourceCitation] = []
    limitations: List[str] = []
    requires_human_review: bool = False
    next_steps: List[str] = []
    referral_service: Optional[ReferralService] = None
