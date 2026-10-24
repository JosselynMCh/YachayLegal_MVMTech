from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.database import init_db
from app.api import chat, documents, voice, review

# Inicializar tablas de base de datos
try:
    init_db()
except Exception as e:
    print(f"Advertencia al inicializar BD: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Asistente Jurídico Bilingüe Quechua-Español con RAG Verificable y Mecanismo de Abstención."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers de la API
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(voice.router, prefix=settings.API_V1_STR)
app.include_router(review.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    """Endpoint de salud del backend para verificar conectividad."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "default_dialect": settings.DEFAULT_QUECHUA_DIALECT
    }

@app.get("/api/dialects")
def get_quechua_dialects():
    """
    Retorna el registro completo de las 4 ramas del quechua peruano:
    - Quechua Sureño
    - Quechua Central
    - Quechua Norteño
    - Quechua Amazónico
    junto con sus variantes y metadatos regionales.
    """
    from app.core.dialects import registry_payload
    return registry_payload()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
