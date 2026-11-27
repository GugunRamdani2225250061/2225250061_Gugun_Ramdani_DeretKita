@echo off
title DeretKita - Pasang Kak Deret di Cloudflare
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\pasang-cloudflare.ps1"
