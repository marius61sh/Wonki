@echo off
title Wonki Server
color 0A
echo.
echo  ==========================================
echo   Wonki - Pornire Server
echo  ==========================================
echo.

cd /d "%~dp0server"

echo  Verificare Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  EROARE: Node.js nu este instalat!
    echo  Descarca de la: https://nodejs.org
    pause
    exit
)

echo  Verificare dependinte...
if not exist "node_modules" (
    echo  Prima pornire - instalez dependintele (dureaza 1-2 min)...
    echo.
    npm install
    echo.
)

echo  ==========================================
echo   Server pornit!
echo.
echo   Site:   http://localhost:3000
echo   Admin:  http://localhost:3000/admin/login.html
echo.
echo   Login:  admin@wonki.ro
echo   Parola: wonki2025
echo  ==========================================
echo.
echo  (Nu inchide aceasta fereastra cat timp folosesti site-ul)
echo.

start "" http://localhost:3000/admin/login.html
npm run dev

pause
