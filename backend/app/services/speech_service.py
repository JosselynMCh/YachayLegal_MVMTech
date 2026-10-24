from typing import Dict, Any, Optional

class SpeechService:
    """
    Paso 8.2 (PDF Pág. 9): Servicio de Voz Asistido y Adaptación de Audio.
    Soporta las 4 ramas del quechua en el Perú y perfiles diferenciados de pronunciación.
    """

    SUPPORTED_VOICE_PROFILES = {
        # Quechua Sureño
        "quechua_chanka": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.0,
            "rate": 0.9,
            "branch": "sureno",
            "label": "Quechua Sureño · Chanka (Ayacucho/Huancavelica/Apurímac)"
        },
        "quechua_cusco_collao": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 0.95,
            "rate": 0.9,
            "branch": "sureno",
            "label": "Quechua Sureño · Cusco-Collao (Cusco/Puno/Arequipa)"
        },
        # Quechua Central
        "quechua_central_ancash": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.02,
            "rate": 0.88,
            "branch": "central",
            "label": "Quechua Central · Áncash (Huaylas-Conchucos)"
        },
        "quechua_central_huanuco_pasco": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.0,
            "rate": 0.88,
            "branch": "central",
            "label": "Quechua Central · Huánuco-Pasco"
        },
        "quechua_central_junin_lima": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.0,
            "rate": 0.88,
            "branch": "central",
            "label": "Quechua Central · Junín-Lima (Wanka)"
        },
        # Quechua Norteño
        "quechua_norteno_cajamarca": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.05,
            "rate": 0.92,
            "branch": "norteno",
            "label": "Quechua Norteño · Cajamarca"
        },
        "quechua_norteno_inkawasi": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.05,
            "rate": 0.9,
            "branch": "norteno",
            "label": "Quechua Norteño · Inkawasi-Kañaris (Lambayeque)"
        },
        # Quechua Amazónico
        "quechua_amazonico_lamas": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.08,
            "rate": 0.92,
            "branch": "amazonico",
            "label": "Quechua Amazónico · Lamista (San Martín/Amazonas)"
        },
        "quechua_amazonico_napo": {
            "code": "qu-PE",
            "fallback_lang": "es-PE",
            "pitch": 1.06,
            "rate": 0.92,
            "branch": "amazonico",
            "label": "Quechua Amazónico · Napo-Pastaza (Loreto/Madre de Dios)"
        },
        # Español
        "es": {
            "code": "es-PE",
            "fallback_lang": "es-419",
            "pitch": 1.0,
            "rate": 1.0,
            "branch": None,
            "label": "Español (Perú) · Sin variante quechua"
        }
    }

    # Transcripciones y audios precargados de alta calidad para las 4 ramas
    PRESET_SAMPLES = [
        # Sureño
        {
            "id": "sample-sureno-1",
            "branch": "sureno",
            "branch_label": "Quechua Sureño (Chanka)",
            "label": "Detención policial e intérprete (Chanka)",
            "audio_quechua": "Policiakunam hap'irqawan, ¿imatan rurayman? ¿Pillapas yanapawanmanchu quechua simipi?",
            "translation_es": "La policía me detuvo, ¿qué puedo hacer? ¿Alguien me puede ayudar en quechua?",
            "dialect": "quechua_chanka"
        },
        {
            "id": "sample-sureno-2",
            "branch": "sureno",
            "branch_label": "Quechua Sureño (Cusco-Collao)",
            "label": "Violencia familiar y medidas de protección (Collao)",
            "audio_quechua": "Qosaymi maqwawan wasiypi, ¿maytan risaq yanapakuy mañakuq? ¿Qolqeta mañawanqakuchu?",
            "translation_es": "Mi esposo me golpea en la casa, ¿a dónde voy a pedir ayuda? ¿Me cobrarán dinero?",
            "dialect": "quechua_cusco_collao"
        },
        # Central
        {
            "id": "sample-central-1",
            "branch": "central",
            "branch_label": "Quechua Central (Áncash)",
            "label": "Detención arbitraria y defensor público (Central - Áncash)",
            "audio_quechua": "Polisiakunam hapimarqan, ¿imataraq rurashaq? Kikïpa shimïchaw amachaqta mañakuyta puydïtsu?",
            "translation_es": "La policía me detuvo, ¿qué voy a hacer? ¿Puedo pedir abogado en mi propio idioma?",
            "dialect": "quechua_central_ancash"
        },
        {
            "id": "sample-central-2",
            "branch": "central",
            "branch_label": "Quechua Central (Huánuco/Junín)",
            "label": "Denuncia de maltrato y pensión de alimentos (Central - Junín)",
            "audio_quechua": "Wawikunapa taytanmi maqaman, manam wambrantsikkunapaq qellayta qomantsu, ¿maychawmi willakushaq?",
            "translation_es": "El papá de mis hijos me agrede y no nos da dinero de alimentos, ¿dónde denuncio?",
            "dialect": "quechua_central_junin_lima"
        },
        # Norteño
        {
            "id": "sample-norteno-1",
            "branch": "norteno",
            "branch_label": "Quechua Norteño (Cajamarca)",
            "label": "Derecho a defensa e intérprete oficial (Norteño - Cajamarca)",
            "audio_quechua": "Comisariapi hapisuptiykiqa, ¿abogadu gratuituta quwankumanchu quechua parlaptiy?",
            "translation_es": "Si me detienen en la comisaría, ¿me darán abogado gratuito si hablo quechua?",
            "dialect": "quechua_norteno_cajamarca"
        },
        # Amazónico
        {
            "id": "sample-amazonico-1",
            "branch": "amazonico",
            "branch_label": "Quechua Amazónico (Lamas / San Martín)",
            "label": "Protección urgente contra violencia familiar (Amazónico - Lamas)",
            "audio_quechua": "Ñukata wasipi makawarkami, ¿comisariapi yanapayta mañayta ushanichu mana kullkiwan?",
            "translation_es": "Me golpearon en mi casa, ¿puedo pedir auxilio en la comisaría sin dinero?",
            "dialect": "quechua_amazonico_lamas"
        },
        {
            "id": "sample-amazonico-2",
            "branch": "amazonico",
            "branch_label": "Quechua Amazónico (Napo / Loreto)",
            "label": "Uso de lengua materna ante juez y fiscal (Amazónico - Napo)",
            "audio_quechua": "Kikin runashimipi juezpa ñawpakpi rimankapak, ¿Estado shimi tikrakta kushka kankachu?",
            "translation_es": "Para hablar en nuestra lengua originaria ante el juez, ¿el Estado debe poner intérprete?",
            "dialect": "quechua_amazonico_napo"
        }
    ]

    @classmethod
    def get_speech_profile(cls, dialect: Optional[str] = None) -> Dict[str, Any]:
        if not dialect or dialect == "es":
            return cls.SUPPORTED_VOICE_PROFILES["es"]
        return cls.SUPPORTED_VOICE_PROFILES.get(dialect, cls.SUPPORTED_VOICE_PROFILES["quechua_chanka"])

    @classmethod
    def get_preset_samples(cls) -> list:
        return cls.PRESET_SAMPLES
