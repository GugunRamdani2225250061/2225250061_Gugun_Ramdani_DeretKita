# Panduan Kak Deret (AI): versi GRATIS

## ⭐ Cara termudah: DeepSeek gratis lewat Puter (tanpa API key, tanpa server)
Kak Deret memakai **jalur gabungan**:
1. Jika **server Kak Deret** tersedia (laptop guru atau Render), dipakai server.
2. Jika **tidak ada server** (misalnya membuka web online di HP), Kak Deret **otomatis memakai DeepSeek gratis lewat Puter.js**.

**Cara siswa memakai (versi web di HP, dari mana saja):**
1. Buka https://gugunramdani2225250061.github.io/2225250061_Gugun_Ramdani_DeretKita/ di HP.
2. Tekan **🤖 Tanya Kak Deret** → **🔐 Masuk akun Puter (gratis)**. Daftar/masuk **sekali saja** (pakai nama pengguna samaran, bukan nama lengkap).
3. Kak Deret langsung menjawab memakai model **DeepSeek** (`deepseek/deepseek-v4.1-flash`, dengan cadangan model DeepSeek lain).

**Yang perlu diketahui:**
- **Gratis untuk Anda.** Biaya AI ditanggung kuota gratis bulanan **akun Puter masing-masing siswa** (model *user-pays*). Jika kuota satu akun habis, Puter menawarkan peningkatan; aplikasi lain tetap berjalan.
- **Privasi:** pertanyaan siswa dikirim ke layanan pihak ketiga (Puter → DeepSeek). Untuk penelitian, sebaiknya ada **izin sekolah/orang tua**, dan siswa **tidak menulis data pribadi**.
- Bisa **dimatikan** di **Pengaturan → "DeepSeek gratis lewat Puter"**, dan bisa keluar akun dengan **"Keluar dari akun Puter"**.
- Di **APK Android**, masuk akun Puter bisa tidak berjalan (jendela login terblokir di aplikasi). Untuk APK, pakai **server Kak Deret** (lihat di bawah) atau versi web.
- Model gratis bisa sesekali keliru; periksa beberapa jawaban saat uji coba.

---

# Jalur server (opsional): siswa tanpa login

**Kak Deret** adalah tutor AI di DeretKita. Ia berperan sebagai **mediator** dalam model *Rigorous Mathematical Thinking* (RMT): **tidak memberi jawaban langsung**, tetapi membimbing siswa dengan pertanyaan pemandu yang singkat.

Sekarang Kak Deret memakai **OpenRouter (gratis, tanpa top up)**. Server Python **memilih sendiri model gratis terbaik** yang tersedia (saat diuji: *Google Gemma 4 31B*) dan **otomatis pindah ke model cadangan** bila kuota satu model habis.

## 🔐 Aturan keamanan API key
- API key **hanya** ditulis di file **`.env`** (laptop) atau di pengaturan **Render** (server online).
- **Jangan** menulis key di kode, GitHub, grup WhatsApp, atau chat AI.
- File `.env` sudah diatur agar **tidak ikut ter-upload** ke GitHub.
- Jika key bocor: buka https://openrouter.ai/keys → hapus key → buat yang baru.

---

## Langkah 1: Buat key OpenRouter gratis (±3 menit)
1. Buka https://openrouter.ai → **Sign in** (bisa dengan akun Google). **Tidak perlu kartu atau top up.**
2. Buka https://openrouter.ai/keys → **Create Key** → beri nama `DeretKita` → **Create**.
3. **Salin key** (diawali `sk-or-...`). Key hanya ditampilkan sekali.

## Langkah 2: Tempel key di laptop
1. Di VS Code, buka file **`.env`** (folder utama proyek).
2. Cari baris `AI_API_KEY=` lalu tempel key-nya:
   ```
   AI_PROVIDER=openrouter
   AI_API_KEY=sk-or-xxxxxxxxxxxxxxxx
   ```
3. Simpan (Ctrl+S).

## Langkah 3: Jalankan
1. Klik dua kali **`mulai-api.bat`** (biarkan jendela hitam terbuka).
2. Klik dua kali **`mulai-aplikasi.bat`** → buka `http://localhost:5173`.
3. Cek: `http://localhost:8000/ai/status` → `"aktif": true, "penyedia": "OpenRouter"`.
4. Kerjakan soal → tekan **🤖 Tanya Kak Deret**.

## 📱 Memakai Kak Deret di smartphone siswa (Wi-Fi yang sama)
Tidak perlu pengaturan tambahan:
1. Klik dua kali **`mulai-semua.bat`** di laptop (menyalakan server Python + aplikasi sekaligus).
2. Di laptop buka `http://localhost:5173` → menu kiri **📱 Buka di HP**.
3. Siswa menyambungkan HP ke **Wi-Fi yang sama** (boleh hotspot HP guru), lalu **memindai kode QR** dengan kamera.
4. Aplikasi terbuka di HP, dan **Kak Deret langsung bisa dipakai**: pertanyaan dari HP diteruskan otomatis ke server Python di laptop.

**Memakai aplikasi APK?** Di APK buka **Pengaturan → Server Kak Deret**, isi alamat yang tertulis di halaman *Buka di HP* di laptop (mis. `http://192.168.1.5:8000`), tekan **Simpan & cek** (harus muncul "✅ Kak Deret aktif").

Jika HP tidak bisa membuka: saat pertama menjalankan, Windows menanyakan izin jaringan untuk *Node.js*/*Python*, jadi pilih **Allow**. Pastikan juga laptop tidak memakai Wi-Fi "Public" yang memblokir perangkat lain.

---

## ⚠️ Batas versi gratis (OpenRouter, November 2026)
| | Batas |
|---|---|
| Per menit | 20 pertanyaan |
| Per hari (akun belum pernah beli kredit) | **50 pertanyaan** |
| Per hari (jika pernah beli kredit ≥ $10) | 1.000 pertanyaan |

**Artinya:** cukup untuk **uji coba dengan beberapa siswa** (mis. siswa yang diwawancara). Untuk **satu kelas penuh** sekaligus, 50/hari kemungkinan kurang. Pilihan saat itu:
- Gunakan Kak Deret bergiliran / hanya untuk soal tertentu, **atau**
- Pindah penyedia (cukup ubah `.env`, tanpa mengubah kode), lihat tabel di bawah.

Jika kuota habis, siswa melihat pesan "Kuota AI gratis sedang habis"; **aplikasi tetap berjalan** (petunjuk & pembahasan tetap ada).

## Ganti penyedia (cukup ubah `.env`)
| `AI_PROVIDER` | Biaya | Key dari | Catatan |
|---|---|---|---|
| `openrouter` | **Gratis** (50/hari) | https://openrouter.ai/keys | Default. Model gratis dipilih otomatis |
| `groq` | Gratis dengan batas | https://console.groq.com/keys | Cepat; batasnya cek di situs Groq |
| `gemini` | Gratis dengan batas | https://aistudio.google.com/apikey | Model Google Gemini |
| `ollama` | Gratis penuh, offline | tanpa key | Pasang https://ollama.com di laptop + unduh model (mis. `ollama pull gemma3`); butuh RAM ≥ 8 GB, lebih lambat |
| `deepseek` | Berbayar (top up) | https://platform.deepseek.com | Key DeepSeek Anda sudah ada di `.env` (saldo 0) |

Untuk memaksa model tertentu, isi `AI_MODEL=nama/model` (boleh beberapa, pisahkan koma sebagai cadangan).

---

## Kak Deret di web online (GitHub Pages)
Server Python harus online. Gunakan **Render.com** (gratis):
1. Daftar di https://render.com dengan akun GitHub.
2. **New → Blueprint** → pilih repo `2225250061_Gugun_Ramdani_DeretKita` (Render membaca `render.yaml`).
3. Isi **AI_API_KEY** dengan key OpenRouter → **Apply**. Tunggu ±5 menit.
4. Salin alamat server (mis. `https://deretkita-api.onrender.com`), cek `…/ai/status` → `"aktif": true`.
5. GitHub repo → **Settings → Secrets and variables → Actions → Variables → New repository variable**: `VITE_API_URL` = alamat server tadi.
6. Tab **Actions** → proses teratas → **Re-run all jobs**.

> Server gratis Render "tidur" jika 15 menit tidak dipakai; pertanyaan pertama setelah tidur butuh ±1 menit. Buka `…/health` sebelum kelas dimulai.

## Cara siswa memakai Kak Deret
| Di mana | Cara |
|---|---|
| Setiap soal | Tombol **🤖 Tanya Kak Deret** → "Aku bingung mulai dari mana" / "Kenapa jawabanku salah?" atau ketik sendiri |
| Contoh soal | **Tanya Kak Deret tentang contoh ini** |
| Refleksi akhir modul | **Minta tanggapan Kak Deret** |
| Menu kiri → Kak Deret | Tanya bebas tentang barisan & deret geometri |

## Data penelitian
Setiap soal mencatat **`ai_dipakai`** (berapa kali siswa bertanya ke Kak Deret), tampil di Dasbor Guru dan CSV uji coba.

## Jika ada masalah
| Pesan | Solusi |
|---|---|
| "Server Python belum berjalan" | Jalankan `mulai-api.bat`, atau cek server Render & `VITE_API_URL` |
| "API key AI belum diisi" | Isi `AI_API_KEY` di `.env`, tutup & jalankan ulang `mulai-api.bat` |
| "API key OpenRouter salah" | Buat key baru di openrouter.ai/keys |
| "Kuota AI gratis sedang habis" | Tunggu (batas per menit) atau besok (batas harian), atau ganti penyedia |
| "Kamu sudah banyak bertanya…" | Batas per perangkat per 10 menit (disengaja agar siswa berpikir dulu) |

**Penting:** model gratis bisa sesekali keliru. Saat uji coba, **baca beberapa jawaban Kak Deret** dan pastikan ia membimbing tanpa membocorkan jawaban.

## Catatan teknis
`services/api/ai.py`: prompt mediator RMT, daftar penyedia (`PENYEDIA`), pemilihan model gratis otomatis (`pilih_model`), cadangan otomatis saat 429, batas pemakaian. Semua penyedia memakai format OpenAI `/chat/completions`.
