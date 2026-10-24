from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.services.retrieval_service import RetrievalService
from app.core.config import settings
from app.models.database import get_db
from app.models.models import Feedback

router = APIRouter(tags=["Documentos y Servicios Oficiales"])

class FeedbackRequest(BaseModel):
    message_id: Optional[str] = None
    user_query: str = Field(..., min_length=2, max_length=1000)
    issue_type: str = Field(..., description="bad_translation, incorrect_law, unclear_explanation, other")
    comment: Optional[str] = Field(None, max_length=1500)

@router.get("/sources")
def list_all_sources():
    """Listado completo de normas peruanas oficiales cargadas en el corpus verificable."""
    return RetrievalService.get_all_official_sources()

@router.get("/sources/{doc_id}")
def get_source_details(doc_id: str):
    """Devuelve los metadatos y el texto oficial de una norma verificada."""
    doc = RetrievalService.get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento legal no encontrado.")
    return doc

@router.get("/services")
def list_legal_aid_services():
    """Directorio de servicios oficiales de defensa pública gratuita y auxilio en el Perú."""
    return [
        {
            "id": "defensa-publica",
            "name": settings.DEFENSA_PUBLICA_NOMBRE,
            "phone": settings.DEFENSA_PUBLICA_FONO,
            "channel": "Fono 1884 (Gratuito a nivel nacional)",
            "languages": ["Español", "Quechua", "Aymara"],
            "coverage": "Nacional - 34 Direcciones Distritales",
            "description": "Defensa penal pública gratuita obligatoria para imputados y víctimas en situación de vulnerabilidad o falta de recursos.",
            "official_url": settings.DEFENSA_PUBLICA_WEB
        },
        {
            "id": "linea-100",
            "name": settings.LINEA_100_NOMBRE,
            "phone": settings.LINEA_100,
            "channel": "Línea telefónica 100 (Atención 24/7 sin costo)",
            "languages": ["Español", "Quechua Chanka", "Quechua Collao", "Aymara"],
            "coverage": "Nacional",
            "description": "Servicio telefónico gratuito especializado en brindar información, orientación, consejería y soporte emocional a personas afectadas por violencia familiar o sexual.",
            "official_url": "https://www.gob.pe/linea100"
        },
        {
            "id": "defensoria-pueblo",
            "name": "Defensoría del Pueblo del Perú",
            "phone": settings.DEFENSORIA_PUEBLO,
            "channel": "0800-15-170",
            "languages": ["Español", "Quechua"],
            "coverage": "Nacional",
            "description": "Protección de derechos fundamentales, acceso a servicios públicos y defensa de los derechos lingüísticos e interculturales.",
            "official_url": "https://www.defensoria.gob.pe"
        }
    ]

@router.post("/feedback")
def submit_user_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    """Permite al ciudadano o revisor reportar una respuesta incorrecta o traducción imprecisa."""
    try:
        feedback_entry = Feedback(
            user_query=req.user_query.strip(),
            issue_type=req.issue_type,
            comment=req.comment.strip() if req.comment else None
        )
        db.add(feedback_entry)
        db.commit()
        db.refresh(feedback_entry)
        return {
            "status": "success", 
            "id": feedback_entry.id,
            "message": "Feedback registrado correctamente en la base de datos para auditoría y mejora continua."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"No se pudo guardar el reporte: {str(e)}")
