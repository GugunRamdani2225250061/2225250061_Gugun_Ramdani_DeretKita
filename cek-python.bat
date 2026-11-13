@echo off
title DeretKita - Cek Python
cd /d "%~dp0"
python --version >nul 2>nul
if errorlevel 1 (
  echo Python belum terpasang. Lihat petunjuk di README.md
  pause
  exit /b
)
echo === Cek kunci jawaban semua soal ===
python analisis\deret_geometri.py
echo.
echo === Analisis uji coba (data contoh) ===
python analisis\analisis_uji_coba.py analisis\data\contoh_uji_coba.csv
echo.
echo Untuk data asli: unduh CSV dari Dasbor Guru, simpan di analisis\data\, lalu jalankan:
echo   python analisis\analisis_uji_coba.py analisis\data\NAMA_FILE.csv
pause
