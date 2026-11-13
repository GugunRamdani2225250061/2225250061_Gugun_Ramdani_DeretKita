# Catatan Progres

Setiap sesi kerja AI atau manusia ditambahkan di **paling atas**. Baca catatan terbaru sebelum melanjutkan.

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
