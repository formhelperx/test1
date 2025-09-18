@echo off
echo ========================================
echo    INICIANDO FRONTEND (React + Vite)
echo ========================================
cd frontend
if not exist node_modules (
    echo Instalando dependencias npm...
    npm install
)
echo.
echo Servidor frontend iniciando...
echo URL: http://localhost:5173
echo.
npm run dev
pause