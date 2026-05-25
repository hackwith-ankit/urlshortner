@echo off
title SmartURL Platform Launcher

echo ==========================================
echo       Starting SmartURL System...
echo ==========================================
echo.

:: Start Backend in a new window
echo [1/2] Launching Spring Boot Backend...
start "SmartURL Backend Server" cmd /k "cd smarturl-backend && .\mvnw spring-boot:run"

:: Start Frontend in a new window
echo [2/2] Launching React/Vite Frontend...
start "SmartURL Frontend Dev" cmd /k "cd smarturl-frontend && npm run dev"

echo.
echo ==========================================
echo Backend API will boot at: http://localhost:8080/
echo Frontend App will boot at: http://localhost:5173/
echo ==========================================
echo.
echo Press any key to close this launcher console (the servers will keep running in their own windows).
pause > nul
