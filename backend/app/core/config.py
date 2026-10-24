from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Yachay Legal AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    
    # Database
    DATABASE_URL: str = "sqlite:///./yachay_legal.db"
    
    # Dialect settings: quechua_chanka, quechua_cusco_collao
    DEFAULT_QUECHUA_DIALECT: str = "quechua_chanka"
    
    # AI & Model APIs (optional)
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    AI_PROVIDER: Optional[str] = "local_gemini"

    # Support & Official referral services
    DEFENSA_PUBLICA_FONO: str = "1884"
    DEFENSA_PUBLICA_NOMBRE: str = "Defensa Pública y Acceso a la Justicia (MINJUSDH)"
    DEFENSA_PUBLICA_WEB: str = "https://www.gob.pe/minjus"
    LINEA_100: str = "100"
    LINEA_100_NOMBRE: str = "Línea 100 - Ayuda contra la violencia familiar y sexual (MIMP)"
    DEFENSORIA_PUEBLO: str = "0800-15-170"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
