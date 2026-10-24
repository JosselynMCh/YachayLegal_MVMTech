from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/chat", tags=["Consultas Jurídicas"])

@router.post("", response_model=ChatResponse)
def process_chat_consultation(request: ChatRequest):
    """
    Endpoint principal para formular consultas legales en Quechua o Español.
    Aplica RAG oficial, verificación en dos etapas y control de abstención.
    """
    try:
        response = AIService.process_consultation(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar la consulta: {str(e)}")
