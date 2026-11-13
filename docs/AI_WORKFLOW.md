# Alur Kerja dengan AI (Claude / ChatGPT)

Prinsip: **AI yang mengoding, kita yang mengontrol dan mencocokkan (cross-check).**

## 1. Pilihan Model
| Alat | Model | Catatan |
|---|---|---|
| Claude Code (VS Code) | **Opus 5.5**, effort **medium** | Pakai *auto mode* agar AI bekerja sampai selesai |
| ChatGPT | GPT-6 Astra | Kuota bisa habis ±30 menit, jadi kerjakan tugas kecil-kecil |

Jika kuota satu AI habis, AI lain bisa melanjutkan karena aturan proyek ada di `CLAUDE.md` / `AGENTS.md` dan riwayatnya di `docs/CATATAN_PROGRES.md`.

## 2. Siklus Kerja
1. **Beri perintah yang jelas dan kecil**, contoh:
   > "Baca CLAUDE.md dan docs/CATATAN_PROGRES.md. Kerjakan Fase 1 poin 1 di ROADMAP.md. Setelah selesai, tulis catatan progres."
2. **Tunggu sampai AI selesai.** Jangan memotong kecuali ada yang lupa.
3. **Interupsi bila lupa sesuatu**: ketik tambahan seperti "tambahkan juga tombol mematikan musik". AI akan menyesuaikan.
4. **Baca catatan** yang ditulis AI di `CATATAN_PROGRES.md`: apa yang dikerjakan dan bagaimana mengeceknya.
5. **Cross-check** dengan daftar di bawah.
6. Jika sesuai → commit & push ke GitHub. Jika belum → beri tahu AI bagian yang salah.

## 3. Daftar Cross-Check (centang setiap kali)
**Matematika**
- [ ] Kunci jawaban benar (hitung manual / `python analisis/deret_geometri.py`)
- [ ] Rumus Uₙ = a·rⁿ⁻¹ dan Sₙ ditulis benar
- [ ] Istilah konsisten (suku, rasio, deret)

**Beban kognitif**
- [ ] Satu layar satu ide, teks pendek
- [ ] Label menyatu dengan gambar
- [ ] Tidak ada hiasan/suara yang mengganggu
- [ ] Ada worked example sebelum latihan, ada hint

**Literasi**
- [ ] Soal konteks punya tahap Pahami → Modelkan → Hitung → Periksa

**Teknis / HP**
- [ ] Jalan di HP (lebar 360 px), tombol mudah ditekan
- [ ] Tombol "Pasang Aplikasi" muncul dan bisa dipasang
- [ ] Tetap bisa dibuka saat mode pesawat (offline)
- [ ] Tidak ada kunci rahasia (`.env`) yang ikut ter-commit

## 4. Aset Lagu & Gambar
- **Lagu**: cari dulu di Google (yang bebas royalti, mis. Pixabay Music), catat judul + link + lisensi di `apps/web/public/media/SUMBER.md`, lalu tunjukkan catatan itu ke AI.
- **Gambar**: desain di Canva → unduh (PNG/SVG) → taruh di `apps/web/public/media/` → minta AI: "Animasikan gambar `bakteri.svg` agar membelah 3 kali dengan CSS, ringan untuk HP."
- Rajin eksplorasi, tetapi pastikan setiap aset **membantu belajar** (prinsip coherence).

## 5. Analisis Aplikasi Pembanding (reverse engineering)
Cara: buka aplikasi lain (Duolingo, Khan Academy, Photomath, GeoGebra), screenshot alurnya, lalu minta AI:
> "Analisis pola desain dari screenshot ini (navigasi, umpan balik, progres). Mana yang cocok diterapkan di DeretKita sesuai prinsip beban kognitif? Jangan menyalin aset atau merek."
Hasilnya catat di PRD bagian 8. Ini untuk keperluan pribadi, jadi tidak perlu membeli aplikasinya.
