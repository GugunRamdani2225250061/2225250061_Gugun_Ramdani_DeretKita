@echo off
title DeretKita - Kunci APK
cd /d "%~dp0"
set KUNCI=apps\web\android\app\deretkita.keystore
set SANDI=apps\web\android\app\kunci-apk-sandi.txt
set REPO=GugunRamdani2225250061/2225250061_Gugun_Ramdani_DeretKita
if not exist "%KUNCI%" goto tidak_ada
if not exist "%SANDI%" goto tidak_ada

echo ==========================================================
echo  Menyimpan kunci APK ke GitHub Secret (sekali saja)
echo  File kunci tetap RAHASIA: tidak di-upload ke repository.
echo ==========================================================

rem --- Cara otomatis: memakai GitHub CLI (gh) jika sudah terpasang & login ---
set GH=gh
where gh >nul 2>nul || set GH="%LOCALAPPDATA%\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin\gh.exe"
%GH% auth status >nul 2>nul
if errorlevel 1 goto cara_manual

echo.
echo  GitHub CLI terdeteksi. Menyimpan Secret secara otomatis...
powershell -NoProfile -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('%KUNCI%'))" | %GH% secret set APK_KEYSTORE_BASE64 --repo %REPO%
if errorlevel 1 goto cara_manual
powershell -NoProfile -Command "(Get-Content -Raw '%SANDI%').Trim()" | %GH% secret set APK_KEYSTORE_PASSWORD --repo %REPO%
if errorlevel 1 goto cara_manual
echo.
echo  Secret tersimpan:
%GH% secret list --repo %REPO%
echo.
echo  Membuat APK baru dengan kunci tetap...
%GH% workflow run apk.yml --repo %REPO%
echo.
echo ==========================================================
echo  SELESAI. Tunggu +-5 menit, lalu unduh APK baru dari:
echo  https://github.com/%REPO%/releases/latest/download/DeretKita.apk
echo.
echo  PENTING (sekali saja): hapus dulu aplikasi DeretKita lama di HP,
echo  lalu pasang APK baru ini. Setelah itu pembaruan berikutnya
echo  bisa langsung menimpa tanpa menghapus data.
echo ==========================================================
pause
exit /b

:cara_manual
echo.
echo  GitHub CLI tidak tersedia / belum login. Memakai cara salin-tempel.
start https://github.com/%REPO%/settings/secrets/actions/new
powershell -NoProfile -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('%KUNCI%')) | Set-Clipboard"
echo.
echo  LANGKAH 1 - kunci sudah DISALIN ke clipboard.
echo      Name  : APK_KEYSTORE_BASE64
echo      Secret: tekan Ctrl+V  lalu klik "Add secret"
pause
powershell -NoProfile -Command "Get-Content -Raw '%SANDI%' | Set-Clipboard"
start https://github.com/%REPO%/settings/secrets/actions/new
echo.
echo  LANGKAH 2 - kata sandi kunci sudah DISALIN ke clipboard.
echo      Name  : APK_KEYSTORE_PASSWORD
echo      Secret: tekan Ctrl+V  lalu klik "Add secret"
pause
powershell -NoProfile -Command "Set-Clipboard -Value ' '"
echo.
echo  SELESAI. Clipboard sudah dikosongkan.
echo  Buka tab Actions ^> "Buat APK Android" ^> Run workflow.
pause
exit /b

:tidak_ada
echo File kunci APK tidak ditemukan di apps\web\android\app\
pause
