@echo off
title DeretKita - API Python
cd /d "%~dp0services\api"

python --version >nul 2>nul
if errorlevel 1 goto tanpa_python

if not exist .venv (
  echo Membuat lingkungan Python untuk pertama kali...
  python -m venv .venv
)
call .venv\Scripts\activate.bat
pip install -q -r requirements.txt

set ENVFILE=
if exist "%~dp0.env" set ENVFILE=--env-file "%~dp0.env"

echo.
echo ==========================================================
echo  API Python berjalan : http://localhost:8000/docs
echo  Di aplikasi: Dasbor Guru ^> "Analisis dengan Python"
echo  Berhenti            : tekan Ctrl+C
echo ==========================================================
echo.
uvicorn main:app --reload --port 8000 %ENVFILE%
pause
exit /b

:tanpa_python
echo Python belum terpasang.
echo Unduh Python 3.12 dari https://www.python.org/downloads/
echo PENTING: centang "Add python.exe to PATH" saat memasang.
start https://www.python.org/downloads/
pause
