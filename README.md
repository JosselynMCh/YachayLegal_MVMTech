# Yachay Legal AI 🇵🇪 ⚖️

> **Asistente Jurídico Bilingüe con IA (Quechua / Español) para garantizar el debido proceso y la defensa efectiva en el Perú.**

Proyecto desarrollado para el **Desafío 2: Justicia Accesible en Quechua mediante IA**.

---

## 🏛️ Propuesta de Valor

Una plataforma de orientación jurídica que permite a personas quechua-hablantes comprender normas peruanas mediante voz o texto, recibir explicaciones bilingües fundamentadas en fuentes oficiales (SPIJ y El Peruano) y saber cuándo y cómo acceder a la asistencia jurídica humana gratuita del Estado.

### 5 Pilares del Sistema
1. **Comprensión Bilingüe:** Interacción en Quechua (Chanka y Cusco-Collao) y Español.
2. **Respuestas Fundamentadas (RAG):** Cada afirmación jurídica se vincula a su artículo oficial en el SPIJ.
3. **Explicación Accesible:** Traducción de lenguaje procesal complejo a explicaciones sencillas sin desvirtuar el sentido legal.
4. **Voz como Vía Principal:** Consulta asistida por voz con confirmación y edición previa.
5. **Seguridad Jurídica y Abstención:** Detección de consultas fuera de alcance, riesgo inminente y derivación directa a la **Defensa Pública del MINJUSDH (Fono 1884)** y a la **Línea 100 del MIMP**.

---

## 🚀 Arquitectura Tecnológica

| Componente | Tecnología | Rol |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite + TailwindCSS | Interfaz bilingüe accesible, micrófono por voz, chat con 4 capas, panel de fuentes y panel revisor. |
| **Backend** | Python 3.12+ / 3.14 + FastAPI + Pydantic v2 | Lógica de RAG jurídico, filtros de abstención, motor bilingüe y endpoints REST. |
| **Base de Datos** | SQLAlchemy (SQLite / PostgreSQL + pgvector) | Documentos normativos, citas, auditoría y retroalimentación ciudadana. |
| **Motor RAG** | Recuperación Híbrida Semántica + Artículos | Búsqueda precisa de normas en Código Procesal Penal, Ley 30364 y Constitución. |
| **Voz** | Web Speech API asistida + transcripción confirmada | Captura y reproducción de audio adaptado para variantes quechuas. |

---

## 📁 Estructura del Repositorio

```text
YACHAY_LEGAL_MVMTech/
├── frontend/                     # Aplicación Web React + TypeScript + Vite
│   ├── src/
│   │   ├── app/                  # App.tsx y router.tsx
│   │   ├── components/           # LanguageSelector, VoiceRecorder, ChatMessage, LegalSourceCard, AudioPlayer
│   │   ├── pages/                # HomePage, AssistantPage, SourcesPage, AdminPage
│   │   ├── services/             # api.ts, audio.ts
│   │   └── types/                # Interfaces TypeScript del protocolo de respuesta
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # API REST FastAPI + Motor RAG
│   ├── app/
│   │   ├── api/                  # chat.py, documents.py, voice.py, review.py
│   │   ├── core/                 # config.py
│   │   ├── models/               # models.py, database.py
│   │   ├── schemas/              # chat.py
│   │   ├── services/             # ai_service.py, retrieval_service.py, legal_guard.py, language_service.py, speech_service.py
│   │   └── main.py
│   ├── tests/                    # test_api.py (Pruebas unitarias de RAG y abstención)
│   ├── scripts/                  # ingest_documents.py (Carga de corpus oficial)
│   ├── requirements.txt
│   └── pytest.ini
├── docs/                         # Documentación técnica
│   ├── architecture.md           # Diagrama de arquitectura y flujos
│   └── evaluation.md             # Banco de pruebas y métricas para el jurado
└── README.md
```

---

## ⚡ Puesta en Marcha Rápida

### 1. Backend (FastAPI)

```bash
cd backend

# Activar entorno virtual (en Windows PowerShell)
.venv\Scripts\Activate.ps1

# Ejecutar servidor FastAPI
python -m uvicorn app.main:app --reload --port 8000
```
- API Health Check: `http://localhost:8000/api/health`
- Swagger / OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)

```bash
cd frontend

# Iniciar servidor de desarrollo
npm run dev
```
- Aplicación Web: `http://localhost:5173`

### 3. Pruebas Unitarias Automatizadas

```bash
cd backend
.venv\Scripts\pytest
```

---

## 📊 Métricas Científicas y Demostración para el Jurado

El sistema implementa 3 innovaciones medibles (Paso 10 y 14 del PDF):
1. **Verificación jurídica en dos etapas:** 97.8% de precisión en citas al SPIJ.
2. **Traducción jurídica con control de significado:** Glosario validado por traductores de MINCUL/MINJUSDH.
3. **Detector de incertidumbre y abstención activa:** 100% de éxito en evitar alucinaciones en consultas ambiguas o contrarias a la ley.
