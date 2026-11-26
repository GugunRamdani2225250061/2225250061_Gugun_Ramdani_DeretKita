# Panduan Kak Deret (AI DeepSeek)

**Kak Deret** adalah tutor AI di DeretKita. Perannya sebagai **mediator** dalam model *Rigorous Mathematical Thinking* (RMT): ia **tidak memberi jawaban langsung**, tetapi membimbing siswa dengan pertanyaan pemandu yang singkat.

## 🔐 Aturan keamanan API key (penting!)
- API key **hanya** ditulis di file **`.env`** (di laptop) atau di pengaturan **Render** (server online).
- **Jangan pernah** menulis API key di kode aplikasi, di GitHub, di grup WhatsApp, atau di chat AI.
- File `.env` sudah diatur agar **tidak ikut ter-upload** ke GitHub.
- Jika key bocor: buka https://platform.deepseek.com/api_keys → hapus key lama → buat key baru.

Mengapa tidak ditaruh di aplikasi web? Karena aplikasi web bisa dilihat isinya oleh siapa saja. Jika key ada di sana, orang lain bisa memakai saldo Anda.

---

## Langkah 1: Buat API key DeepSeek
1. Daftar/masuk di https://platform.deepseek.com
2. Menu **Top up**: isi saldo (pemakaian dipotong dari saldo; Rp20.000–50.000 cukup untuk uji coba).
3. Menu **API keys** → **Create new API key** → beri nama `DeretKita` → **salin key** (`sk-...`). Key hanya ditampilkan sekali.

> Biaya model `deepseek-flash` (per 1 juta token): input ±$0,15–0,30, output ±$0,60–1,20. Satu pertanyaan Kak Deret biasanya < 2.000 token, jadi sekitar **ribuan pertanyaan** untuk $1.

## Langkah 2: Pakai di laptop (untuk uji coba di kelas)
1. Buka file **`.env`** di folder utama proyek (sudah dibuatkan). Di VS Code: klik `.env` di panel kiri.
2. Isi baris ini dengan key Anda, lalu **Simpan** (Ctrl+S):
   ```
   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Klik dua kali **`mulai-api.bat`** (server Python + Kak Deret). Biarkan jendela hitamnya terbuka.
4. Klik dua kali **`mulai-aplikasi.bat`**, lalu buka `http://localhost:5173`.
5. Cek: buka `http://localhost:8000/ai/status` → harus tertulis `"aktif": true`.

**Siswa memakai HP di Wi-Fi yang sama?** Buka aplikasi dari alamat *Network* (mis. `http://192.168.1.5:5173`). Lalu isi `.env`:
```
VITE_API_URL=http://192.168.1.5:8000
```
(ganti dengan IP laptop Anda), lalu jalankan ulang `mulai-aplikasi.bat`.

## Langkah 3: Pakai online (web GitHub Pages, bisa dari mana saja)
Server Python perlu online. Gunakan **Render.com** (gratis):
1. Daftar di https://render.com memakai akun GitHub.
2. **New → Blueprint** → pilih repo `2225250061_Gugun_Ramdani_DeretKita` → Render membaca file `render.yaml`.
3. Saat diminta, isi **DEEPSEEK_API_KEY** dengan key Anda → **Apply**.
4. Tunggu ±5 menit. Salin alamat server, mis. `https://deretkita-api.onrender.com`. Cek: buka `…/ai/status` → `"aktif": true`.
5. Di GitHub repo: **Settings → Secrets and variables → Actions → tab Variables → New repository variable**:
   - Name: `VITE_API_URL`
   - Value: `https://deretkita-api.onrender.com`
6. Tab **Actions** → proses teratas → **Re-run all jobs**. Setelah hijau, Kak Deret aktif di web online.

> Server gratis Render "tidur" jika 15 menit tidak dipakai. Pertanyaan pertama setelah tidur butuh ±1 menit. Buka `…/health` beberapa menit sebelum kelas dimulai.

---

## Cara siswa memakai Kak Deret
| Di mana | Cara | Mode |
|---|---|---|
| **Setiap soal** | Tombol **🤖 Tanya Kak Deret** di bawah soal → pilih "Aku bingung mulai dari mana" / "Kenapa jawabanku salah?" atau ketik sendiri | Mediasi (RMT tahap 3) |
| **Contoh soal** | Tombol **Tanya Kak Deret tentang contoh ini** | Mediasi (RMT tahap 2) |
| **Refleksi akhir modul** | Setelah menulis refleksi → **Minta tanggapan Kak Deret** | Refleksi (pujian, meluruskan, transendensi) |
| **Menu kiri → Kak Deret** | Tanya bebas tentang barisan & deret geometri | Tanya |

Contoh percakapan:
> **Siswa:** Kenapa jawabanku salah? (menjawab rasio = 3 untuk 3, 6, 12, 24)
> **Kak Deret:** Kamu menghitung 6 − 3, ya? Pada barisan geometri kita mencari **pengali** yang tetap. Coba hitung 6 : 3 dan 12 : 6. Apa yang kamu dapat?

## Pengaturan (file `.env` / Render)
| Nama | Isi | Keterangan |
|---|---|---|
| `DEEPSEEK_API_KEY` | `sk-...` | **wajib** |
| `DEEPSEEK_MODEL` | `deepseek-flash` | atau `deepseek-v4-pro` (lebih pintar, ±4× lebih mahal) |
| `AI_BATAS_PER_10_MENIT` | `20` | batas pertanyaan per perangkat per 10 menit |
| `AI_BATAS_HARIAN` | `1000` | batas total pertanyaan per hari (melindungi saldo) |

## Data penelitian
Setiap soal mencatat **`ai_dipakai`** (berapa kali siswa bertanya ke Kak Deret). Kolom ini ada di **Dasbor Guru** (kolom *AI*) dan di **CSV uji coba**, sehingga bisa dianalisis bersama skor dan beban kognitif. Penggunaan Kak Deret juga dihitung sebagai `butuh_bantuan = 1`.

## Jika ada masalah
| Pesan | Penyebab & solusi |
|---|---|
| "Server Python belum berjalan atau belum online" | Jalankan `mulai-api.bat`, atau cek server Render & variabel `VITE_API_URL` |
| "API key DeepSeek belum diisi" | Isi `DEEPSEEK_API_KEY` di `.env`, lalu tutup & jalankan ulang `mulai-api.bat` |
| "API key DeepSeek salah atau sudah dihapus" | Buat key baru di platform.deepseek.com |
| "Saldo DeepSeek habis" | Top up di platform.deepseek.com |
| "Kamu sudah banyak bertanya…" | Batas per 10 menit tercapai (disengaja agar siswa berpikir dulu) |

## Catatan teknis
- Kode: `services/api/ai.py` (prompt mediator RMT, panggilan DeepSeek, batas pemakaian), endpoint `POST /ai` dan `GET /ai/status` di `services/api/main.py`, tampilan `apps/web/src/components/KakDeret.jsx`.
- DeepSeek dipanggil di `https://api.deepseek.com/chat/completions` (format OpenAI), `max_tokens` 400, mode *thinking* dimatikan agar cepat & hemat.
- Kunci jawaban dikirim ke AI sebagai konteks rahasia (agar AI bisa menilai cara berpikir siswa) dengan instruksi tegas untuk tidak menyebutkannya. **Tetap periksa** contoh percakapan saat uji coba, karena AI bisa saja keliru.
