# Database (Supabase): opsional

Aplikasi **tetap jalan tanpa Supabase**: semua data disimpan di perangkat (localStorage) dan bisa diunduh sebagai CSV dari Dasbor Guru. Supabase dipakai jika ingin data seluruh siswa terkumpul online secara otomatis.

## Desain
- **Materi & soal** disimpan di kode (`apps/web/src/content/`), jadi mudah diedit dan tercatat di GitHub.
- **Data siswa** (jawaban, angket, refleksi) disimpan lokal dulu, lalu dikirim ke Supabase lewat antrean (`apps/web/src/lib/sinkron.js`). Jika offline, data dikirim saat online lagi.
- Siswa masuk **tanpa email** (Supabase Anonymous Sign-in) dengan nama panggilan + kode kelas.

| Tabel | Isi |
|---|---|
| `profiles` | nama panggilan, kode siswa anonim, kode kelas, peran |
| `jawaban` | satu baris = satu soal selesai: benar, skor_bagian, waktu, hint, persepsi, Paas |
| `angket` | respon Leppink / SUS + skor |
| `refleksi` | tulisan refleksi siswa per modul |

SQL lengkap: [supabase/migrations/0001_init.sql](../supabase/migrations/0001_init.sql). RLS aktif, jadi setiap siswa hanya bisa membaca dan menulis datanya sendiri.

## Cara menyalakan Supabase (±10 menit)
1. Buat akun dan proyek baru di https://supabase.com (gratis).
2. **SQL Editor** → New query → tempel isi `0001_init.sql` → **Run**.
3. **Authentication → Sign In / Providers** → aktifkan **Allow anonymous sign-ins**.
4. **Project Settings → API**: salin *Project URL* dan *anon public key*.
5. Salin `.env.example` menjadi `.env` di folder utama, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
6. Jalankan ulang `mulai-aplikasi.bat`. Di Pengaturan aplikasi akan tertulis "Penyimpanan online: aktif".
7. Untuk versi online (GitHub Pages): isi kedua nilai itu di GitHub → Settings → Secrets and variables → Actions → **Secrets**.

## Mengambil data untuk analisis
- Supabase → Table Editor → `jawaban` → **Export to CSV** → `python analisis/analisis_uji_coba.py file.csv`, atau
- API Python: isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di `.env`, jalankan `mulai-api.bat`, lalu buka `http://localhost:8000/analisis/supabase?kode_kelas=9A`.
