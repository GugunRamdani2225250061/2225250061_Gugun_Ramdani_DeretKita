# Catatan Progres

Setiap sesi kerja AI atau manusia ditambahkan di **paling atas**. Baca catatan terbaru sebelum melanjutkan.

---

## 26 November 2026 — Objek 3D bergerak di halaman selamat datang & Peta Petualangan
- **Yang dikerjakan**:
  - Komponen baru `Bangun3D.jsx`: bangun ruang 3D sungguhan dengan CSS 3D (tanpa pustaka): kubus, balok, prisma segitiga, prisma segi enam, tabung, kerucut, limas, limas segitiga, bola, serta bangun datar tebal yang berputar seperti koin (persegi, segitiga, segi enam, lingkaran).
  - **Halaman selamat datang**: di layar lebar ada panel kiri (Bangun Ruang: kubus & limas, tabung/kerucut/bola, prisma & balok, bola memantul 160 → 80 → 40 → 20 → 10) dan panel kanan (Bangun Datar & Pola: segitiga Sierpinski 1, 3, 9, 27, batang ×2: 1, 2, 4, 8, 16, bangun datar berputar, orbit). Di HP: baris objek ringkas di atas formulir.
  - **Peta Petualangan**: setiap kartu modul punya objek 3D berputar (M0 persegi, M1 prisma segitiga, M2 prisma segi enam, M3 bola, M4 kubus, M5 tabung, M6 limas).
  - Semua gerakan otomatis berhenti jika HP/laptop diatur "kurangi gerakan" (aksesibilitas). Objek bergerak hanya ada di halaman masuk & lobi, tidak di layar belajar.
- **File yang berubah**: `components/Bangun3D.jsx`, `components/ObjekBergerak.jsx` (baru), `components/GridModul.jsx`, `pages/Masuk.jsx`, `styles.css`, `coba/DeretKita.html`.
- **Cara mengecek**: buka web di laptop (panel kiri & kanan) dan di HP (baris objek di atas formulir). Masuk, lalu lihat Peta Petualangan.

---

## 26 November 2026 — Huruf bisa diganti & menu diperbanyak
- **Yang dikerjakan**:
  - **Pilihan huruf**: 7 jenis (default **Lexend**, yang dirancang agar mudah dibaca) + 4 ukuran (Kecil–Sangat besar), dengan pratinjau. Font disimpan di dalam aplikasi (`@fontsource`), jadi tetap jalan offline. Pengaturan lama "huruf besar" otomatis dipindah.
  - **Menu kiri**: 13 menu dalam 4 kelompok (Belajar, Teman Belajar, Saya, Guru), kartu progres mini, "Rumus kilat", tombol cepat "Aa" ke pengaturan huruf, dan hiasan bangun ruang.
  - **Halaman baru**: ⚡ Latihan Kilat (10 soal acak dari rumus, skor & beruntun, *bukan* data penelitian), 📐 Kartu Rumus, 📖 Kamus Istilah (bisa dicari), 🏅 Lencana (11 penghargaan), ❓ Bantuan.
  - Lobi: bagian "Jelajahi" berisi 8 pintasan bergambar bangun datar/ruang.
- **File yang berubah**: `apps/web/src/lib/fonts.js`, `lib/latihan.js` (+ tes), `content/kamus.js`, `components/Sidebar.jsx`, `pages/` (Pengaturan, LatihanKilat, KartuRumus, Kamus, Lencana, Bantuan, Beranda), `App.jsx`, `lib/store.js`, `styles.css`, `package.json`, `vite.config.js`, `coba/DeretKita.html`.
- **Hasil uji**: `npm test` 8/8 (termasuk 3.000 soal Latihan Kilat acak: semua kunci bilangan bulat & valid). Uji browser 45/45 lulus, termasuk ganti huruf tersimpan, dan semua halaman pas di HP 360px meski huruf "Sangat besar". Bug yang ditemukan & diperbaiki: tombol ukuran huruf keluar layar saat huruf sangat besar.
- **Cara mengecek**: menu kiri → Pengaturan (atau tombol "Aa") → pilih huruf & ukuran. Coba Latihan Kilat, Kamus, Kartu Rumus, Lencana.
- **Catatan**: file `coba/DeretKita.html` sekarang ±1 MB karena huruf ikut disimpan di dalamnya.

---

## 26 November 2026 — Kak Deret (AI DeepSeek), model RMT, lobi baru & menu kiri
- **Yang dikerjakan**:
  - **Kak Deret**: tutor AI DeepSeek (`deepseek-flash`) sebagai mediator RMT. Ada di setiap soal, contoh soal, refleksi, dan halaman Tanya. Tidak memberi jawaban akhir, maksimal ±60 kata. API key **hanya** di `.env`/server, pemakaian dibatasi (per 10 menit & per hari). Pemakaian AI dicatat (`ai_dipakai`) di Dasbor & CSV.
  - **Model RMT**: 3 tahap (Pengembangan Kognitif → Konten sebagai Proses → Praktik Konstruksi Kognitif Konseptual). Penunjuk tahap tampil di setiap layar modul, dan ada halaman penjelasan RMT.
  - **Tampilan**: menu vertikal di kiri (HP: kolom ikon, disembunyikan saat belajar), lobi baru (hero bergradasi, cincin progres, statistik, kartu rumus, kartu modul berlambang bangun datar/ruang, latar rumus & bangun melayang), halaman masuk baru, halaman Semua Modul & Angket.
  - Finishing: `mulai-api.bat` bisa diakses HP satu Wi-Fi, `render.yaml` untuk server online, `.env` sudah dibuat (tinggal isi key), migrasi Supabase `0002_ai_dipakai.sql`.
- **File yang berubah**: `services/api/ai.py` (baru), `services/api/main.py`, `services/api/test_main.py`, `apps/web/src/` (Sidebar, LatarMatematika, Bentuk, GridModul, KakDeret, RmtTahap, content/rmt.js, pages Beranda/Masuk/DaftarModul/AngketMenu/Tanya/Rmt, App, Soal, Segmen, Modul, styles.css), `docs/RMT.md`, `docs/PANDUAN_AI_DEEPSEEK.md`, `render.yaml`, `.env.example`, `mulai-api.bat`, `coba/DeretKita.html`.
- **Hasil uji (oleh AI)**: `npm test` 7/7, `pytest` 8/8, 22 kunci jawaban benar. Uji browser lengkap 29/29 lulus memakai server Python asli dan **DeepSeek palsu** (agar tidak memakai saldo), termasuk: API key tidak pernah sampai ke browser, tahap RMT benar, tidak ada geser ke samping di HP 360px, menu kiri di laptop, offline, dan file `coba/DeretKita.html`.
- **Cara mengecek (untuk Gugun)**:
  1. Buat API key DeepSeek → isi di `.env` → jalankan `mulai-api.bat` & `mulai-aplikasi.bat` (lihat `docs/PANDUAN_AI_DEEPSEEK.md`).
  2. Kerjakan satu soal, jawab salah, lalu tekan **🤖 Tanya Kak Deret** → pastikan ia membimbing, bukan memberi jawaban.
  3. Coba menu kiri di laptop dan di HP.
- **Yang belum / masalah**:
  - Kak Deret **belum dicoba dengan DeepSeek asli** karena API key belum ada. Periksa kualitas jawabannya saat pertama dipakai.
  - Agar Kak Deret aktif di web online (GitHub Pages), server Python harus di-deploy ke Render dan `VITE_API_URL` diisi di GitHub (langkah ada di panduan).
- **Langkah berikutnya**: isi API key, coba Kak Deret, uji coba soal ke siswa, deploy server ke Render.

---

## 13 November 2026 — Tampilan lebih berwarna
- **Yang dikerjakan**: setiap modul punya warna & ikon sendiri (dipakai di daftar modul, kepala halaman, tombol, progres). Kepala & kartu sapaan bergradasi; label layar berwarna (💡 Istilah, 📖 Materi, ✏️ Contoh, 🎯 Soal); huruf pilihan ganda berwarna; skala usaha mental hijau (ringan) → merah (berat); animasi bintang saat modul selesai. Warna simbol **a/r/n** di rumus tidak diubah (prinsip *signaling*).
- **File yang berubah**: `apps/web/src/styles.css` (blok "TEMA WARNA-WARNI" di akhir file), `content/modul.js` (TEMA warna & ikon), `Beranda.jsx`, `Modul.jsx`, `Layout.jsx`, `Segmen.jsx`, `Soal.jsx`, `RatingBeban.jsx`, `Masuk.jsx`, `coba/DeretKita.html`.
- **Cara mengecek**: buka web atau `coba/DeretKita.html`. Untuk mengganti warna sebuah modul, ubah kode warna di `TEMA` pada `apps/web/src/content/modul.js`.
- **Hasil uji**: `npm test` 7/7 lulus, uji browser 22/22 lulus, tidak ada error di konsol.

---

## 13 November 2026 — Aplikasi versi awal selesai & diuji
- **Yang dikerjakan**:
  - Aplikasi React + Vite lengkap: 7 modul materi, 18 soal (13 bank soal + 5 cek), contoh terurai dengan fading, soal literasi 4 langkah, petunjuk bertingkat, umpan balik miskonsepsi, rating Paas, mode uji coba (persepsi kesulitan), refleksi, Kalkulator Pola, angket Leppink & SUS, Dasbor guru (unduh CSV + analisis Python), pengaturan huruf besar.
  - PWA: bisa di-install dan jalan offline. Versi satu file `coba/DeretKita.html` bisa dibuka tanpa memasang apa pun.
  - API Python (FastAPI) + `analisis/angket.py`; `analisis_uji_coba.py` kini bisa membaca banyak CSV sekaligus dan menerima CSV dari aplikasi.
  - Supabase opsional (`supabase/migrations/0001_init.sql`), GitHub Actions (tes + terbit ke GitHub Pages), file `.bat` untuk Windows.
- **Hasil uji (oleh AI)**:
  - `npm test`: 7/7 lulus (rumus, format angka Indonesia, validasi konten & kunci soal).
  - Python: 22/22 kunci jawaban benar; `pytest services/api`: 3/3 lulus.
  - Uji otomatis di browser Edge ukuran HP (360×800): 22 pemeriksaan lulus, termasuk masuk, modul M0/M2/M3 sampai selesai, umpan balik miskonsepsi, fading, format "12.800.000", kalkulator, angket, dasbor, unduh CSV, service worker, **mode offline**, dan file `coba/DeretKita.html`. Tidak ada error di konsol.
  - Bug yang ditemukan & diperbaiki: tombol "Lanjut" terkunci di materi (urutan efek React).
- **Cara mengecek (untuk Gugun)**:
  1. Klik dua kali `coba/DeretKita.html` → masuk → kerjakan Modul 0 dan Modul 2.
  2. Coba jawab salah dengan sengaja (mis. 2³ = 6, suku ke-8 = 768) → umpan balik khusus harus muncul.
  3. Buka Dasbor Guru → Unduh CSV → buka di Excel.
  4. Pasang Node.js & Python → jalankan `mulai-aplikasi.bat` dan `cek-python.bat`.
- **Yang belum / masalah**:
  - Node.js dan Python belum terpasang di laptop ini (AI memakai versi portabel sementara untuk pengujian).
  - Belum diuji di HP Android sungguhan: lakukan setelah terbit di GitHub Pages.
  - Supabase belum dibuat (opsional). Tanpa Supabase, data tersimpan di masing-masing perangkat dan dikumpulkan lewat CSV.
  - Semua soal masih `draft` sampai diuji coba ke siswa.
- **Langkah berikutnya**: uji coba soal ke siswa memakai aplikasi (mode uji coba), push ke GitHub, aktifkan GitHub Pages.

---

## 13 November 2026 — Dokumen perencanaan awal
- **Yang dikerjakan**: membuat semua dokumen perencanaan (PRD, CLAUDE.md, arsitektur, database, desain konten, bank soal draft, instrumen, roadmap, alur kerja AI) dan skrip Python penelitian.
- **File yang berubah**: `README.md`, `CLAUDE.md`, `AGENTS.md`, `.gitignore`, `.env.example`, `docs/*`, `analisis/*`
- **Cara mengecek (untuk Gugun)**:
  1. Buka `docs/PRD.md` dan baca apakah tujuan & fitur sudah sesuai keinginan.
  2. Buka terminal VS Code, jalankan `python analisis/deret_geometri.py` → harus muncul "Semua kunci jawaban BENAR".
  3. Jalankan `python analisis/analisis_uji_coba.py analisis/data/contoh_uji_coba.csv` → muncul tabel analisis soal (data contoh).
  4. Cek soal di `docs/BANK_SOAL_DRAFT.md`, hitung ulang 2–3 soal secara manual.
- **Yang belum / masalah**:
  - Folder Google Drive wawancara **tidak bisa dibuka AI** (perlu login). Unduh transkripnya, simpan di `docs/data-wawancara/`, lalu isi bagian "Temuan wawancara" di PRD.
  - Kode aplikasi (React/Supabase) belum dibuat, sesuai Fase 1 di ROADMAP.
  - **Python belum terpasang di laptop ini**, jadi skrip belum dijalankan. Kunci jawaban sudah dicek manual. Pasang Python 3.11+ dari https://www.python.org/downloads/ (centang "Add python.exe to PATH"), lalu jalankan langkah 2–3 di atas.
- **Langkah berikutnya**: uji coba soal ke siswa (Lembar C), lalu push ke GitHub.
