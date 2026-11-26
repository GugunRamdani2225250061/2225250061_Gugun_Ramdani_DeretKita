# CLAUDE.md — Panduan untuk AI (Claude / ChatGPT / Codex)

Proyek: **DeretKita**, aplikasi matematika SMP (PWA) untuk mengelola **beban kognitif** dan menumbuhkan **literasi matematika** pada materi **Barisan & Deret Geometri dalam Keseharian**.
Pemilik: Gugun Ramdani, S1 Pendidikan Matematika. Pemilik **bukan programmer profesional**, jadi jelaskan dengan bahasa sederhana.

## Baca dulu sebelum bekerja
1. [docs/PRD.md](docs/PRD.md): apa yang dibangun dan kenapa
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): stack, struktur folder, PWA
3. [docs/DATABASE.md](docs/DATABASE.md): skema Supabase
4. [docs/CONTENT_DESIGN.md](docs/CONTENT_DESIGN.md): aturan desain materi (CLT + literasi)
5. [docs/CATATAN_PROGRES.md](docs/CATATAN_PROGRES.md): **lanjutkan dari catatan terakhir**

## Stack
- **Frontend**: React 18 + Vite, **JavaScript (JSX)**, React Router (HashRouter), CSS biasa (`src/styles.css`), `vite-plugin-pwa`, `@supabase/supabase-js` (opsional, dimuat dinamis)
- Materi: `apps/web/src/content/modul.js`, soal: `apps/web/src/content/soal.js` (ID sama dengan `docs/BANK_SOAL_DRAFT.md`)
- **Backend analisis**: **Python 3.11+**, FastAPI, pandas (untuk statistik). Aturan pembagian bahasa:
  - Logika **umum** aplikasi (UI, navigasi, alur belajar, cek jawaban sederhana) → **JavaScript**
  - Pengolahan **data statistik** (analisis butir soal, beban kognitif, SUS, laporan) → **Python**
- **Database/Auth/Storage**: **Supabase** (Postgres + RLS)
- Deploy: frontend ke Vercel/Netlify, API Python ke Render/Railway (gratis)

## Perintah
```bash
# Frontend (atau klik dua kali mulai-aplikasi.bat)
cd apps/web && npm install && npm run dev      # http://localhost:5173 (+ alamat Network untuk HP)
npm test                                        # uji rumus & validasi konten/kunci soal
npm run build && npm run preview                # cek PWA hasil build
npm run build:offline                           # perbarui coba/DeretKita.html (WAJIB setelah mengubah konten)
# API Python (atau mulai-api.bat)
cd services/api && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
pytest services/api                             # butuh: pip install httpx pytest
# Analisis penelitian (hanya pustaka standar)
python analisis/deret_geometri.py               # cek kunci jawaban
python analisis/analisis_uji_coba.py analisis/data/contoh_uji_coba.csv
```

## Aturan wajib
1. **Kebenaran matematika nomor satu.** Setiap soal/kunci jawaban baru harus ditambahkan ke pengecekan di `analisis/deret_geometri.py` dan `apps/web/src/content/konten.test.js`, lalu tes dijalankan. Jangan mengarang angka.
2. **Prinsip beban kognitif** (cek setiap membuat layar materi):
   - 1 layar = 1 ide; teks maksimal ±40 kata per layar
   - Label diletakkan langsung di gambar (jangan dipisah)
   - Tidak ada hiasan/animasi/suara yang tidak membantu belajar; musik **default mati**
   - Worked example dulu, baru latihan; hint bertingkat
3. **Mobile-first**: desain untuk lebar 360 px dulu. Tombol ≥ 44 px, huruf ≥ 16 px.
4. **Bahasa Indonesia** sederhana untuk semua teks UI. Nama variabel/kode boleh bahasa Inggris.
5. **Privasi siswa**: tidak menyimpan nama lengkap, foto, atau nomor HP. Jangan pernah commit file di `docs/data-wawancara/raw/` atau `.env`.
6. **API key AI** (`AI_API_KEY`, default penyedia **OpenRouter gratis**; atau `DEEPSEEK_API_KEY`) hanya di `.env` / pengaturan server (Render). Jangan pernah menaruhnya di kode frontend, variabel `VITE_*`, atau commit. Jalur server lewat `services/api/ai.py`. **Satu-satunya jalur AI dari browser** adalah **Puter.js** (`src/lib/puter.js`, DeepSeek gratis, *tanpa* API key; siswa masuk akun Puter sendiri), dipakai otomatis bila server tidak tersedia dan bisa dimatikan di Pengaturan. Prompt RMT ada di dua tempat yang **harus sama**: `ai.py` dan `src/lib/promptRMT.js`. Kunci tanda tangan APK (`*.keystore`, `kunci-apk-sandi.txt`) juga **tidak boleh** di-commit.
7. **Model RMT**: setiap layar modul punya tahap RMT (`content/rmt.js`; segmen boleh `rmt: 1|2|3`). Kak Deret = mediator: tidak memberi jawaban akhir, maksimal ±60 kata.
8. Hiasan (bangun datar/ruang melayang, `LatarMatematika`) **hanya** di lobi & halaman masuk, **tidak** di layar belajar (prinsip coherence).
9. Soal berstatus `draft` hanya untuk **mode uji coba** (lencana "uji coba" tampil). Untuk penelitian lapangan, pakai soal berstatus `siap` (sudah diuji coba ke siswa dan direvisi). Jaga `soal.js` dan [docs/BANK_SOAL_DRAFT.md](docs/BANK_SOAL_DRAFT.md) tetap sama.
10. Kerjakan per **tugas kecil**, lalu jalankan/cek hasilnya sebelum lanjut.

## Setelah setiap sesi kerja (WAJIB)
Tambahkan entri di [docs/CATATAN_PROGRES.md](docs/CATATAN_PROGRES.md) dengan format:
```
## [tanggal] — judul singkat
- Yang dikerjakan:
- File yang berubah:
- Cara mengecek (langkah untuk Gugun):
- Yang belum / masalah:
- Langkah berikutnya:
```
Pemilik akan membaca catatan ini lalu **mengontrol & mencocokkan (cross-check)** hasilnya dengan [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md).
