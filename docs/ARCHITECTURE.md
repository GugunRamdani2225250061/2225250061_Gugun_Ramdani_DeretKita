# Arsitektur Teknis: DeretKita

## 1. Gambaran Umum
```
 HP / Laptop siswa (browser, ikon PWA terpasang, atau file coba/DeretKita.html)
        │
        ▼
 ┌──────────────────────────────┐   (opsional)  ┌──────────────────────────┐
 │ Frontend: React + Vite (JS)  │──────────────►│ Supabase                 │
 │ - materi, soal, cek jawaban  │  supabase-js  │ - Auth anonim            │
 │ - simpan lokal (localStorage)│               │ - Postgres + RLS         │
 │ - service worker (offline)   │               └────────────▲─────────────┘
 └──────────────┬───────────────┘                            │ service key
                │ POST /analisis (tombol di Dasbor)          │
                ▼                                            │
 ┌──────────────────────────────┐                            │
 │ API Python (FastAPI)         │────────────────────────────┘
 │ - analisis butir soal        │
 │ - skor angket (SUS, Leppink) │   memakai fungsi yang sama dengan
 └──────────────────────────────┘   skrip penelitian di analisis/
```
- **JavaScript** = semua hal *umum* (tampilan, alur belajar, cek jawaban).
- **Python** = semua hal *statistik* (analisis data uji coba & angket).

## 2. Struktur Folder
```
├── CLAUDE.md, AGENTS.md, README.md
├── mulai-aplikasi.bat           # klik dua kali: jalankan aplikasi (butuh Node.js)
├── mulai-api.bat                # klik dua kali: jalankan API Python
├── cek-python.bat               # klik dua kali: cek kunci jawaban + analisis contoh
├── coba/DeretKita.html          # versi satu file, bisa langsung dibuka (tanpa install)
├── docs/                        # perencanaan & instrumen penelitian
├── apps/web/                    # React + Vite (JavaScript)
│   ├── public/icons/            # ikon PWA (dibuat oleh scripts/make-icons.mjs)
│   ├── scripts/                 # pembuat ikon, rename build offline
│   └── src/
│       ├── main.jsx, App.jsx, styles.css
│       ├── content/modul.js     # MATERI (7 modul)  <- edit materi di sini
│       ├── content/soal.js      # SOAL + kunci + hint + umpan balik <- edit soal di sini
│       ├── content/konten.test.js
│       ├── lib/geometri.js      # rumus Un, Sn, pembaca angka format Indonesia
│       ├── lib/store.js         # penyimpanan lokal
│       ├── lib/sinkron.js       # antrean kirim ke Supabase (opsional)
│       ├── lib/statistik.js     # ringkasan dasbor, CSV
│       ├── lib/install.js       # tombol "Pasang Aplikasi"
│       ├── components/          # Segmen, Soal, RatingBeban, Visual, Rumus, Teks, Layout
│       └── pages/               # Masuk, Beranda, Modul, Kalkulator, Angket, Dasbor, Pengaturan
├── services/api/                # FastAPI (main.py, test_main.py)
├── analisis/                    # skrip Python penelitian (pustaka standar saja)
├── supabase/migrations/         # SQL
└── .github/workflows/deploy.yml # tes otomatis + terbit ke GitHub Pages
```

## 3. Frontend
| Kebutuhan | Pilihan |
|---|---|
| Build tool | Vite 5 |
| UI | React 18 (JSX) + CSS biasa (tanpa framework, agar ringan) |
| Routing | React Router, **HashRouter** (bisa jalan di GitHub Pages dan di file lokal) |
| Grafik & animasi | SVG/CSS buatan sendiri (tanpa pustaka) |
| Rumus | HTML `<sup>`/`<sub>` + warna simbol (tanpa KaTeX) |
| Data | localStorage → (opsional) Supabase |

Ukuran build: ±75 KB gzip untuk JS utama. Pustaka Supabase hanya diunduh jika Supabase diaktifkan.

## 4. PWA: dipasang tanpa Play Store
- `vite-plugin-pwa`: manifest (`standalone`, ikon 192/512/maskable), service worker menyimpan semua file sehingga aplikasi **jalan offline**.
- Tombol **"Pasang"** muncul di Beranda (Android/Chrome/Edge). Untuk iPhone, tampil petunjuk *Bagikan → Tambahkan ke Layar Utama*.
- Syarat: dibuka lewat **HTTPS** (GitHub Pages/Netlify/Vercel) atau `localhost`.
- **Versi satu file** (`npm run build:offline` → `coba/DeretKita.html`): semua kode dalam satu HTML, bisa dibuka dengan klik dua kali atau dikirim ke laptop lain. Versi ini tidak bisa di-*install*.
- **APK (opsional)**: bungkus URL GitHub Pages dengan https://www.pwabuilder.com → Android → unduh `.apk`, lalu bagikan langsung ke siswa (*sideload*).

## 5. API Python
| Method | Path | Fungsi |
|---|---|---|
| GET | `/health` | cek server |
| POST | `/analisis` | body `{records, angket}` dari Dasbor → statistik butir + skor angket |
| GET | `/geometri?a=&r=&n=` | hitung Uₙ dan Sₙ |
| GET | `/analisis/supabase?kode_kelas=` | analisis langsung dari data Supabase (butuh service key) |
| GET | `/ai/status` | apakah Kak Deret aktif (API key DeepSeek terisi) |
| POST | `/ai` | body `{mode: mediasi\|refleksi\|tanya, konteks, pesan, riwayat}` → `{jawaban}`; diteruskan ke DeepSeek `deepseek-flash` |

**Kak Deret (AI)**: `services/api/ai.py` menyusun prompt mediator RMT dan memanggil penyedia AI berformat OpenAI `/chat/completions` sesuai `.env` (`AI_PROVIDER`: **openrouter** gratis (default), deepseek, groq, gemini, ollama). Jika `AI_MODEL` kosong, server mengambil daftar model penyedia lalu memilih maksimal 3 model gratis terbaik (`pilih_model`), dan otomatis mencoba model berikutnya bila kena 429/404/5xx. Key (`AI_API_KEY`) tidak pernah ke browser. Pemakaian dibatasi per perangkat per 10 menit & per hari. Panduan: [PANDUAN_AI_DEEPSEEK.md](PANDUAN_AI_DEEPSEEK.md). Deploy online: `render.yaml` (Render Blueprint).

**Tampilan**: `components/Sidebar.jsx` (menu kiri), `LatarMatematika.jsx` + `Bentuk.jsx` (bangun datar/ruang SVG), `GridModul.jsx`, `RmtTahap.jsx`, `KakDeret.jsx`; halaman `Beranda` (lobi), `DaftarModul`, `AngketMenu`, `Tanya`, `Rmt`.

Dokumentasi interaktif: `http://localhost:8000/docs`. Deploy (opsional): Render.com → root `services/api` → start `uvicorn main:app --host 0.0.0.0 --port $PORT`, lalu isi variabel `VITE_API_URL` di GitHub.

## 6. Pengujian
| Uji | Perintah |
|---|---|
| Rumus & konten soal (JS) | `cd apps/web && npm test` |
| Kunci jawaban (Python) | `python analisis/deret_geometri.py` |
| API | `pip install httpx pytest && pytest services/api` |
| Otomatis di GitHub | setiap push (lihat tab *Actions*) |

## 7. Uji di Smartphone
- Satu Wi-Fi: jalankan `mulai-aplikasi.bat`, lalu buka alamat **Network** (mis. `http://192.168.1.5:5173`) di HP. Tombol "Pasang" tidak muncul karena alamatnya bukan HTTPS; itu normal.
- Online + bisa dipasang: push ke GitHub → `https://USERNAME.github.io/NAMA-REPO/`.
- Cek kualitas: Chrome DevTools → Lighthouse (PWA & Performance).
