# Memasang server Kak Deret di Cloudflare Workers (GRATIS).
# Dijalankan lewat pasang-cloudflare.bat di folder utama proyek.
$ErrorActionPreference = 'Continue'
$root = Split-Path $PSScriptRoot -Parent
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [Environment]::GetEnvironmentVariable('Path', 'Machine')
Set-Location "$root\services\cloudflare-ai"

Write-Host ''
Write-Host '=========================================================' -ForegroundColor Cyan
Write-Host ' DeretKita: memasang Kak Deret di Cloudflare (gratis)' -ForegroundColor Cyan
Write-Host '=========================================================' -ForegroundColor Cyan
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host 'Node.js belum terpasang. Pasang dari https://nodejs.org lalu ulangi.' -ForegroundColor Red
  Read-Host 'Tekan Enter untuk menutup'; exit 1
}

Write-Host "`n[1/4] Menyiapkan alat Cloudflare (wrangler)..."
npm install --no-fund --no-audit | Out-Null

Write-Host "`n[2/4] Masuk akun Cloudflare. Browser akan terbuka:" -ForegroundColor Yellow
Write-Host '      - Belum punya akun? Pilih Sign up (gratis), verifikasi email, lalu kembali ke sini.'
Write-Host '      - Klik "Allow" untuk mengizinkan wrangler.'
npx wrangler login

Write-Host "`n[3/4] Mengunggah server Kak Deret ke Cloudflare Pages (*.pages.dev)..." -ForegroundColor Yellow
Write-Host '      (Bukan *.workers.dev karena domain itu diblokir sebagian penyedia internet di Indonesia.)'
$wrangler = "$root\services\cloudflare-ai\node_modules\.bin\wrangler.cmd"
Set-Location "$root\services\cloudflare-ai-pages"
& $wrangler pages project create deretkita-ai --production-branch main 2>&1 | Out-Null  # abaikan jika sudah ada
$hasil = (& $wrangler pages deploy --branch main --commit-dirty=true 2>&1 | Out-String)
Write-Host $hasil
$m = [regex]::Match($hasil, 'https://[a-z0-9]+\.([a-z0-9-]+)\.pages\.dev')
$url = if ($m.Success) { "https://$($m.Groups[1].Value).pages.dev" } else { '' }
if (-not $url) {
  Write-Host "`nAlamat server tidak terbaca otomatis." -ForegroundColor Red
  $url = (Read-Host 'Tempel alamat https://NAMA.pages.dev (tanpa kode acak di depan)').Trim().TrimEnd('/')
}
if ($url -notmatch '^https://[a-z0-9-]+\.pages\.dev$') {
  Write-Host 'Alamat tidak valid. Ulangi pasang-cloudflare.bat.' -ForegroundColor Red
  Read-Host 'Tekan Enter untuk menutup'; exit 1
}

Write-Host "`n[4/4] Mengecek server: $url"
try {
  $s = Invoke-RestMethod "$url/ai/status" -TimeoutSec 30
  Write-Host "      Kak Deret aktif = $($s.aktif), model = $($s.model)" -ForegroundColor Green
  $uji = Invoke-RestMethod "$url/ai" -Method Post -ContentType 'application/json; charset=utf-8' -TimeoutSec 90 `
    -Body ([Text.Encoding]::UTF8.GetBytes('{"mode":"tanya","pesan":"Apa itu rasio pada barisan geometri? Jawab singkat."}'))
  Write-Host "      Uji jawaban: $($uji.jawaban)" -ForegroundColor Green
} catch { Write-Host "      Uji gagal: $($_.Exception.Message). Coba lagi beberapa menit lagi." -ForegroundColor Yellow }

[IO.File]::WriteAllText("$root\apps\web\src\lib\server-ai.json", "{`n  `"url`": `"$url`"`n}`n")
Write-Host "`nAlamat server disimpan ke apps\web\src\lib\server-ai.json" -ForegroundColor Green

$jawab = Read-Host "`nUpload ke GitHub sekarang agar web & APK memakai Kak Deret dari Cloudflare? (Y/N)"
if ($jawab -match '^[Yy]') {
  Set-Location $root
  git add apps/web/src/lib/server-ai.json
  git commit -m "Pasang alamat server Kak Deret (Cloudflare Workers AI)"
  git push
  Write-Host "`nSELESAI! Sekitar 3-5 menit lagi web online & APK baru memakai Kak Deret dari Cloudflare." -ForegroundColor Green
} else {
  Write-Host "`nBelum di-upload. Jalankan nanti: git add, commit, push." -ForegroundColor Yellow
}
Read-Host "`nTekan Enter untuk menutup"
