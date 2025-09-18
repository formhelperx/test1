@echo off
echo ========================================
echo    INICIANDO BACKEND (FastAPI)
echo ========================================
cd backend
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)
echo Activando entorno virtual...
call .\venv\Scripts\activate
echo Instalando dependencias...
pip install fastapi uvicorn python-docx
echo.
echo Servidor backend iniciando...
echo URL: http://127.0.0.1:8000
echo.
uvicorn main:app --reload
pause