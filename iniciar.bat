@echo off
title Yachay Legal AI - Lanzador del Sistema
chcp 65001 > nul
echo ==============================================================
echo        YACHAY LEGAL AI - ASISTENTE JURIDICO BILINGÜE
echo ==============================================================
echo.
echo Iniciando Backend (FastAPI en http://127.0.0.1:8000)...
start "Yachay Legal - Backend FastAPI" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Iniciando Frontend (Vite en http://localhost:5173)...
start "Yachay Legal - Frontend React" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==============================================================
echo  Listo. Los dos servicios se abrieron en ventanas separadas:
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://127.0.0.1:8000/docs
echo ==============================================================
pause
