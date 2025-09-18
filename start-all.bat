@echo off
echo ========================================
echo    INICIANDO BACKEND + FRONTEND
echo ========================================
echo.

:: Crear scripts temporales
echo Creando scripts temporales...

:: Script para backend
echo @echo off > backend_temp.bat
echo cd /d "%~dp0backend" >> backend_temp.bat
echo if not exist venv python -m venv venv >> backend_temp.bat
echo call venv\Scripts\activate >> backend_temp.bat
echo pip install fastapi uvicorn python-docx >> backend_temp.bat
echo uvicorn main:app --reload >> backend_temp.bat
echo pause >> backend_temp.bat

:: Script para frontend  
echo @echo off > frontend_temp.bat
echo cd /d "%~dp0frontend" >> frontend_temp.bat
echo if not exist node_modules npm install >> frontend_temp.bat
echo npm run dev >> frontend_temp.bat
echo pause >> frontend_temp.bat

echo Iniciando backend...
start "Backend Server" cmd /k "backend_temp.bat"

timeout /t 5 /nobreak

echo Iniciando frontend...
start "Frontend Server" cmd /k "frontend_temp.bat"

echo.
echo ========================================
echo     ¡SERVIDORES INICIADOS!
echo ========================================
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
pause

:: Limpiar temporales (después de 10 segundos)
timeout /t 10 /nobreak
del backend_temp.bat
del frontend_temp.bat