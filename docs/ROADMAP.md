# Roadmap & Daftar Tugas

## ❗ Tugas Minggu Depan (tenggat: ± 20 November 2026)
- [ ] Instrumen siap: [INSTRUMEN.md](INSTRUMEN.md) (A–H), dicek dosen
- [ ] Draft soal siap: [BANK_SOAL_DRAFT.md](BANK_SOAL_DRAFT.md)
- [ ] **Uji coba soal ke siswa yang diwawancara** (Lembar C, think-aloud) → isi `analisis/data/uji_coba.csv`
- [ ] Jalankan `python analisis/analisis_uji_coba.py analisis/data/uji_coba.csv` → revisi soal (terlalu mudah / sesuai / sulit)
- [ ] Taruh transkrip wawancara di `docs/data-wawancara/` (anonim) dan isi bagian "Temuan" di PRD
- [ ] Buat repo GitHub dan push folder ini (langkahnya di [../README.md](../README.md)), lalu kirim link ke Pak Aan
- [ ] Pastikan folder berisi file Python dan materi barisan & deret geometri dalam keseharian ✅ (sudah ada)

## Fase 1–3: Aplikasi versi awal ✅ (selesai 13 Nov 2026)
- [x] React + Vite + React Router, PWA (ikon, offline, tombol Pasang)
- [x] Komponen: Segmen, contoh terurai + fading, hint bertingkat, rating beban, soal literasi 4 langkah
- [x] Modul M0–M6, 13 soal bank + 5 soal cek, refleksi, bintang
- [x] Kalkulator Pola, angket Leppink & SUS
- [x] Dasbor guru + unduh CSV/JSON + analisis Python
- [x] API Python FastAPI (`/analisis`, `/geometri`, `/analisis/supabase`)
- [x] Supabase (opsional): SQL + antrean sinkron offline
- [x] GitHub Actions: tes otomatis + terbit ke GitHub Pages
- [ ] Buat proyek Supabase & isi `.env` (jika ingin data online), lihat [DATABASE.md](DATABASE.md)
- [ ] Uji install di 2+ HP Android siswa lewat link GitHub Pages
- [ ] Ganti/ tambah gambar dari Canva & musik (opsional) di `apps/web/public/media/`

## Fase 4: Validasi (minggu 7–8)
- [ ] Validasi ahli materi & media (Lembar G, H) → revisi
- [ ] Uji kelompok kecil (5–10 siswa) → angket E & F
- [ ] Lighthouse PWA/Performance ≥ 90, uji di 2+ HP Android

## Fase 5: Uji Lapangan & Laporan
- [ ] Pretest → pembelajaran dengan aplikasi → posttest
- [ ] Analisis Python (deskriptif, N-gain, beban kognitif, SUS)
- [ ] (Opsional) bungkus menjadi APK dengan Bubblewrap/Capacitor
