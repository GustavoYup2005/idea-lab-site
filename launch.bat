@echo off
cd /d "%~dp0"
git pull
if errorlevel 1 exit /b 1
call npm install
if errorlevel 1 exit /b 1
call npm run dev
