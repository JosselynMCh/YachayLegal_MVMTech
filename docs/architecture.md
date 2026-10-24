# Yachay Legal AI - Arquitectura del Sistema

## 1. Visión General
**Yachay Legal AI** es un asistente jurídico bilingüe (Quechua / Español) impulsado por IA y Retrieval-Augmented Generation (RAG) diseñado para acercar la justicia y garantizar el debido proceso a comunidades quechua-hablantes en el Perú.

## 2. Componentes Principales

```
+-------------------------------------------------------------+
|                      FRONTEND (Vite + React + TS)           |
| - Interfaz Bilingüe (Quechua Chanka / Cusco-Collao / ES)    |
| - Grabador / Transcriptor de Voz Asistido                   |
| - Chat con 4 capas: Simple, Quechua, Artículos, Pasos      |
| - Tarjeta de Fuentes Oficiales (SPIJ, El Peruano)           |
| - Botón de reporte y derivación inmediata                   |
+------------------------------+------------------------------+
                               | REST API (JSON)
+------------------------------v------------------------------+
|                   BACKEND (FastAPI + Python)                 |
|                                                             |
|  [ API Layer ]                                              |
|  /api/chat            -> Procesamiento consulta legal       |
|  /api/voice/transcribe -> STT y normalización Quechua        |
|  /api/voice/speak     -> TTS audio Quechua / Español        |
|  /api/sources/{id}    -> Metadatos de leyes peruanas         |
|  /api/services        -> Directorio Defensa Pública/Línea100|
|  /api/feedback        -> Reporte de errores jurídicos       |
|  /api/admin/*         -> Métricas, revisión y validación    |
|                                                             |
|  [ Services & Guardrails Layer ]                            |
|  - legal_guard.py      -> Detector de incertidumbre y riesgo |
|  - retrieval_service   -> Búsqueda semántica + filtros ley   |
|  - ai_service.py       -> Síntesis con evidencia estricta    |
|  - language_service.py -> Normalizador Quechua Chanka/Collao|
|  - speech_service.py   -> Adaptador audio/voz               |
|                                                             |
|  [ Data Layer ]                                             |
|  - PostgreSQL + pgvector (o Vector Storage local)           |
|  - Corpus oficial (Código Procesal Penal, Ley 30364, Const.)|
+-------------------------------------------------------------+
```

## 3. Principio de Verificabilidad y Abstención
1. **Evidencia Oficial Exclusiva:** Ninguna respuesta se emite sin citas a artículos normativos comprobables.
2. **Abstención Automática (`insufficient_evidence`):** Si una consulta excede el corpus o requiere asesoría judicial particular, el sistema se abstiene de dar consejos procesales definitivos y deriva a la Defensa Pública (Fono 1884) o Línea 100.
3. **Control Lingüístico:** Diferenciación entre traducción validada y traducción asistida preliminar, con flag de revisión humana.
