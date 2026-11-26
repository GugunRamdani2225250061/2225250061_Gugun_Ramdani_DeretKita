@echo off
title DeretKita - Kunci APK
cd /d "%~dp0"
set KUNCI=apps\web\android\app\deretkita.keystore
set SANDI=apps\web\android\app\kunci-apk-sandi.txt
if not exist "%KUNCI%" goto tidak_ada
if not exist "%SANDI%" goto tidak_ada

echo ==========================================================
echo  Menyimpan kunci APK ke GitHub Secret (sekali saja)
echo  File kunci tetap RAHASIA: tidak di-upload ke GitHub.
echo  JANGAN kirim isi clipboard ke siapa pun / grup / chat.
echo ==========================================================
start https://github.com/GugunRamdani2225250061/2225250061_Gugun_Ramdani_DeretKita/settings/secrets/actions/new

powershell -NoProfile -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('%KUNCI%')) | Set-Clipboard"
echo.
echo  LANGKAH 1 - kunci sudah DISALIN ke clipboard.
echo    Di halaman GitHub yang terbuka:
echo      Name  : APK_KEYSTORE_BASE64
echo      Secret: tekan Ctrl+V  lalu klik "Add secret"
echo.
pause

powershell -NoProfile -Command "Get-Content -Raw '%SANDI%' | Set-Clipboard"
start https://github.com/GugunRamdani2225250061/2225250061_Gugun_Ramdani_DeretKita/settings/secrets/actions/new
echo.
echo  LANGKAH 2 - kata sandi kunci sudah DISALIN ke clipboard.
echo      Name  : APK_KEYSTORE_PASSWORD
echo      Secret: tekan Ctrl+V  lalu klik "Add secret"
echo.
pause
powershell -NoProfile -Command "Set-Clipboard -Value ' '"
echo.
echo  SELESAI. Clipboard sudah dikosongkan.
echo  Buka tab Actions ^> "Buat APK Android" ^> Run workflow untuk membuat APK baru.
echo  Simpan cadangan folder apps\web\android\app (kunci) di tempat aman.
pause
exit /b

:tidak_ada
echo File kunci APK tidak ditemukan di apps\web\android\app\
pause
