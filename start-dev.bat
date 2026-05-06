@echo off
cd /d "%~dp0"
start "Backend" cmd /k "npm run server"
start "Frontend" cmd /k "npm run dev"
