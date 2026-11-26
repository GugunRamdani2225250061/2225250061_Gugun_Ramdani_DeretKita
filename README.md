# DeretKita
Aplikasi matematika SMP (web + Android lewat PWA) untuk **mengelola beban kognitif** dan **menumbuhkan literasi matematika** pada materi **Barisan & Deret Geometri dalam Keseharian**.

Gugun Ramdani (2225250061), S1 Pendidikan Matematika.

---

## 🚀 Cara mencoba

### Cara 1: Langsung, tanpa memasang apa pun
Klik dua kali **`coba/DeretKita.html`**. Aplikasi terbuka di browser dan semua fitur bisa dicoba (data tersimpan di browser itu).

### Cara 2: Mode pengembangan (bisa dibuka di HP satu Wi-Fi)
1. Pasang **Node.js LTS** dari https://nodejs.org (sekali saja).
2. Klik dua kali **`mulai-aplikasi.bat`**.
3. Laptop: buka `http://localhost:5173`. HP: buka alamat **Network** yang muncul di jendela hitam.

### Cara 3: Online dan bisa di-*install* di HP (tanpa Play Store)
1. Upload ke GitHub (lihat bawah).
2. GitHub → repo → **Settings → Pages → Source: GitHub Actions**.
3. Tunggu ±2 menit (tab **Actions** berwarna hijau). Aplikasi online di `https://USERNAME.github.io/NAMA-REPO/`.
4. Buka link itu di Chrome HP → tombol **Pasang** di Beranda (atau menu ⋮ → *Install app*). Aplikasi muncul sebagai ikon dan bisa dipakai offline.

### Python (analisis statistik)
1. Pasang **Python 3.12** dari https://www.python.org/downloads/ (centang **Add python.exe to PATH**).
2. **`cek-python.bat`**: cek semua kunci jawaban + contoh analisis uji coba.
3. **`mulai-api.bat`**: menjalankan API Python. Di aplikasi: **Dasbor Guru → Analisis dengan Python**.

### 🤖 Kak Deret (AI DeepSeek)
1. Buat API key di https://platform.deepseek.com/api_keys (isi saldo dulu).
2. Buka file **`.env`** di folder ini → isi `DEEPSEEK_API_KEY=sk-...` → simpan.
3. Jalankan **`mulai-api.bat`** lalu **`mulai-aplikasi.bat`**.
4. Di aplikasi: tombol **🤖 Tanya Kak Deret** di setiap soal, atau menu kiri **Kak Deret**.

API key **tidak pernah** ditaruh di kode/GitHub. Panduan lengkap (termasuk agar aktif di web online lewat Render.com): [docs/PANDUAN_AI_DEEPSEEK.md](docs/PANDUAN_AI_DEEPSEEK.md).

---

## 🧪 Alur uji coba soal ke siswa (tugas minggu ini)
1. Buka aplikasi di HP/laptop. **Mode uji coba** sudah aktif (Pengaturan), jadi setelah setiap soal siswa ditanya tingkat kesulitannya (terlalu mudah / sesuai / sulit / terlalu sulit) dan usaha mentalnya (skala 1–9).
2. Siswa mengerjakan modul sambil *think-aloud*; peneliti mencatat di Lembar C ([docs/INSTRUMEN.md](docs/INSTRUMEN.md)).
3. Waktu, jawaban, penggunaan petunjuk, dan rating **tercatat otomatis**.
4. **Dasbor Guru → Unduh CSV uji coba** → simpan ke `analisis/data/`.
5. `python analisis/analisis_uji_coba.py analisis/data/uji_coba_TANGGAL.csv` → rekomendasi revisi per soal.
6. Revisi soal di `apps/web/src/content/soal.js` dan `docs/BANK_SOAL_DRAFT.md`, lalu ubah `status` menjadi `'siap'`.

## Fitur
- **Lobi** penuh warna dengan bangun datar, bangun ruang, dan rumus melayang; **menu vertikal di kiri** (di HP menjadi kolom ikon dan disembunyikan saat belajar agar fokus)
- **Model pembelajaran RMT** (*Rigorous Mathematical Thinking*): setiap layar modul menunjukkan tahapnya. Amati & kenali → Bangun konsep → Terapkan & hubungkan ([docs/RMT.md](docs/RMT.md))
- **Kak Deret**: tutor AI (DeepSeek) sebagai mediator RMT, membimbing dengan pertanyaan, tidak memberi jawaban langsung
- 7 modul: pre-training istilah → pola dikali → suku ke-n → pola mengecil → deret → geometri vs aritmetika → tantangan literasi
- Materi per layar pendek, visual animasi (bakteri, lipatan kertas, bola memantul, pesan berantai), warna simbol konsisten (**a** biru, **r** oranye, **n** hijau)
- Contoh soal terurai + *fading* (siswa mengisi langkah yang dikosongkan)
- Soal literasi bertahap: **Pahami → Modelkan → Hitung → Periksa**
- Petunjuk bertingkat, umpan balik khusus untuk miskonsepsi umum, pembahasan
- Rating beban mental (Paas 1–9) setiap soal, angket Leppink & SUS
- Refleksi tertulis setiap akhir modul, bintang progres
- Kalkulator Pola (a, r, n → barisan, grafik, Uₙ, Sₙ)
- Dasbor guru: statistik per soal, unduh CSV/JSON, analisis Python
- PWA: bisa di-*install*, jalan **offline**; data sinkron ke Supabase jika diaktifkan ([docs/DATABASE.md](docs/DATABASE.md))
- Huruf besar dan mode gelap otomatis

## Isi Folder
| File/Folder | Isi |
|---|---|
| [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) | Aturan untuk AI (Claude / ChatGPT) |
| [docs/PRD.md](docs/PRD.md) | Kebutuhan produk |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arsitektur, struktur folder, PWA, API |
| [docs/DATABASE.md](docs/DATABASE.md) | Supabase (opsional) |
| [docs/CONTENT_DESIGN.md](docs/CONTENT_DESIGN.md) | Desain materi (beban kognitif + literasi) |
| [docs/BANK_SOAL_DRAFT.md](docs/BANK_SOAL_DRAFT.md) | 13 draft soal + kunci |
| [docs/INSTRUMEN.md](docs/INSTRUMEN.md) | Instrumen penelitian A–H |
| [docs/RMT.md](docs/RMT.md) | Model pembelajaran RMT & penerapannya |
| [docs/PANDUAN_AI_DEEPSEEK.md](docs/PANDUAN_AI_DEEPSEEK.md) | Cara memasang & memakai Kak Deret (API key DeepSeek) |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Jadwal & tugas |
| [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) | Cara kerja dengan AI + daftar cross-check |
| [docs/CATATAN_PROGRES.md](docs/CATATAN_PROGRES.md) | Catatan setiap sesi kerja |
| [apps/web/](apps/web/) | Aplikasi React + Vite |
| [services/api/](services/api/) | API Python (FastAPI) |
| [analisis/](analisis/) | Skrip Python penelitian |

## Upload ke GitHub
1. Buat repo baru di https://github.com/new (mis. `deretkita`). Jangan centang "Add README".
2. Di terminal VS Code (folder ini):
```bash
git init
git add .
git commit -m "DeretKita versi awal"
git branch -M main
git remote add origin https://github.com/USERNAME/deretkita.git
git push -u origin main
```
3. Bagikan link repo ke dosen (Pak Aan). Beliau bisa membukanya di VS Code: `git clone <link>`, lalu menjalankan `mulai-aplikasi.bat`.
