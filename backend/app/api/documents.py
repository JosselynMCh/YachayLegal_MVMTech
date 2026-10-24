from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from app.services.retrieval_service import RetrievalService
from app.core.config import settings

router = APIRouter(tags=["Documentos y Servicios Oficiales"])

class FeedbackRequest(BaseModel):
    message_id: str | None = None
    user_query: str
    issue_type: str  # "bad_translation", "incorrect_law", "unclear_explanation", "other"
    comment: str | None = None

# Lista de feedback en memoria para desarrollo
feedback_db: List[Dict[str, Any]] = []

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
def submit_user_feedback(req: FeedbackRequest):
    """Permite al ciudadano o revisor reportar una respuesta incorrecta o traducción imprecisa."""
    item = req.dict()
    feedback_db.append(item)
    return {"status": "success", "message": "Feedback registrado correctamente para auditoría y mejora continua."}
