@echo off
title DeretKita
cd /d "%~dp0"

echo Menyalakan server Python (Kak Deret + analisis) di jendela terpisah...
start "DeretKita - Server Python" cmd /k call "%~dp0mulai-api.bat"
timeout /t 3 /nobreak >nul

echo.
echo ==========================================================
echo  Setelah aplikasi terbuka, buka menu "Buka di HP" lalu
echo  pindai kode QR dengan kamera HP (HP harus satu Wi-Fi).
echo ==========================================================
call "%~dp0mulai-aplikasi.bat"
