@echo off
title DeretKita - Aplikasi
cd /d "%~dp0apps\web"

call npm --version >nul 2>nul
if errorlevel 1 goto tanpa_node

if not exist node_modules (
  echo Memasang paket untuk pertama kali, tunggu sebentar...
  call npm install
)

echo.
echo ==========================================================
echo  Buka di laptop : http://localhost:5173
echo  Buka di HP     : menu "Buka di HP" (kode QR), atau alamat "Network" di bawah
echo                   (HP harus satu Wi-Fi dengan laptop; Kak Deret ikut jalan)
echo  Jika Windows bertanya izin jaringan untuk Node.js, pilih "Allow".
echo  Berhenti       : tekan Ctrl+C
echo ==========================================================
echo.
call npm run dev
pause
exit /b

:tanpa_node
echo Node.js belum terpasang.
echo Unduh versi LTS dari https://nodejs.org lalu jalankan file ini lagi.
echo (Sementara itu, buka coba\DeretKita.html untuk mencoba aplikasinya.)
start https://nodejs.org/
pause
