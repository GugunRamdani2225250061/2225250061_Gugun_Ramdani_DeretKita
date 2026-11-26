# Desain Konten: Barisan & Deret Geometri dalam Keseharian

## 1. Prinsip Desain (Cognitive Load Theory, Mayer & Sweller)
| Prinsip | Penerapan di DeretKita | Jenis beban |
|---|---|---|
| **Pre-training** | Kenalkan istilah (suku, rasio, deret, pangkat) sebelum materi inti | Intrinsik ↓ |
| **Segmenting** | 1 layar = 1 ide, siswa menekan "Lanjut" sendiri | Intrinsik dikelola |
| **Worked example** | Contoh terurai sebelum latihan | Ekstrinsik ↓ |
| **Fading** | Contoh 1 lengkap → contoh 2 satu langkah kosong → latihan mandiri | Germane ↑ |
| **Spatial contiguity** | Label angka langsung di gambar bakteri/bola | Ekstrinsik ↓ |
| **Signaling** | Warna konsisten: **a** = biru, **r** = oranye, **n** = hijau | Ekstrinsik ↓ |
| **Coherence** | Tidak ada gambar/musik hiasan yang tidak berhubungan | Ekstrinsik ↓ |
| **Redundancy** | Jangan tampilkan narasi audio + teks yang sama persis | Ekstrinsik ↓ |
| **Self-explanation** | Pertanyaan "Mengapa dikali, bukan ditambah?" | Germane ↑ |
| **Hint bertingkat** | Arah → rumus → langkah | Intrinsik dikelola |

**Aturan warna simbol**: `a` (suku pertama) biru · `r` (rasio) oranye · `n` (urutan suku) hijau · `Uₙ`/`Sₙ` hitam tebal.

## 2. Kerangka Literasi Matematika (PISA 2022)
Setiap soal literasi memakai 4 langkah di layar:
1. **Pahami**: Apa yang diketahui? Apa yang ditanya? (siswa menandai informasi penting)
2. **Merumuskan (Modelkan)**: Apakah polanya dikali tetap? Berapa a dan r?
3. **Menggunakan (Hitung)**: Pakai Uₙ atau Sₙ.
4. **Menafsirkan & Mengevaluasi**: Apakah hasilnya masuk akal dalam konteks nyata?

Konteks PISA: **personal** (tabungan, lipat kertas), **pekerjaan** (penyusutan harga), **sosial** (pesan berantai, berita viral), **ilmiah** (bakteri, obat, pantulan bola).

## 2b. Model Pembelajaran RMT
Setiap modul mengikuti 3 tahap *Rigorous Mathematical Thinking* (rincian: [RMT.md](RMT.md)):
1. **Pengembangan Kognitif**: kartu istilah & visual (fungsi kognitif kualitatif)
2. **Konten sebagai Proses**: menurunkan rumus dari tabel pola, contoh terurai + fading (kuantitatif & tepat)
3. **Praktik Konstruksi Kognitif Konseptual**: soal literasi 4 langkah & refleksi (relasional-abstrak)

Mediator: guru dan **Kak Deret** (AI), yang membimbing dengan pertanyaan tanpa memberi jawaban.

**Kebijakan hiasan**: bangun datar/ruang & rumus melayang hanya di lobi dan halaman masuk (motivasi). Layar belajar tetap bersih (prinsip *coherence*).

## 3. Peta Modul
| Modul | Judul | Isi | Estimasi |
|---|---|---|---|
| M0 | Pre-training | Kosakata: pola, suku, rasio, pangkat (2³ = 2×2×2) | 5 menit |
| M1 | Pola yang Dikali | Kertas dilipat, bakteri membelah → menemukan rasio | 10 menit |
| M2 | Suku ke-n | Uₙ = a·rⁿ⁻¹ (mengapa pangkatnya n−1?) | 15 menit |
| M3 | Pola yang Mengecil | r antara 0 dan 1: pantulan bola, obat, penyusutan | 10 menit |
| M4 | Deret (Jumlah) | Sₙ: pesan berantai, tabungan berlipat | 15 menit |
| M5 | Geometri vs Aritmetika | Membedakan "ditambah tetap" vs "dikali tetap" | 10 menit |
| M6 | Tantangan Literasi | Soal konteks berlevel, pilih keputusan | 20 menit |

## 4. Contoh Alur Segmen (M2: Suku ke-n)
1. **Segmen 1**: Animasi bakteri: 3 → 6 → 12 → 24. Label "×2" di antara tiap gambar.
2. **Segmen 2**: Tabel: suku ke-1 = 3, ke-2 = 3×2, ke-3 = 3×2×2. Warna oranye pada ×2.
3. **Segmen 3**: "Suku ke-4 dikali 2 sebanyak **3** kali → 3×2³". Pola: dikali sebanyak (n−1).
4. **Segmen 4**: Rumus Uₙ = **a**·**r**ⁿ⁻¹.
5. **Worked example 1** (lengkap) → **Worked example 2** (1 langkah kosong) → **Latihan**.
6. Rating beban (1–9) + pertanyaan self-explanation.

## 5. Kesalahan Umum Siswa (untuk umpan balik)
| Miskonsepsi | Umpan balik |
|---|---|
| Memakai rⁿ, bukan rⁿ⁻¹ | "Suku pertama belum dikali. Coba hitung manual sampai suku ke-3." |
| Menganggap pola ditambah | "Cek: 6 − 3 = 3, tetapi 12 − 6 = 6. Selisihnya tidak tetap, coba dibagi." |
| Rasio dibalik (r = 1/2 ditulis 2) | "Polanya mengecil atau membesar?" |
| Bingung Uₙ vs Sₙ | "Yang ditanya satu hari tertentu atau jumlah semuanya?" |
| 2³ dihitung 2×3 | Kembali ke kartu pre-training pangkat |

## 6. Aset Media
- **Gambar/animasi**: desain di **Canva** (ekspor PNG/SVG/MP4 pendek atau GIF ≤ 500 KB), lalu minta AI menganimasikannya dengan CSS/Lottie. Simpan di `apps/web/public/media/` dan catat sumbernya di `apps/web/public/media/SUMBER.md`.
- **Musik/efek suara** (opsional): cari dulu di Google yang **bebas royalti** (mis. Pixabay Music, YouTube Audio Library), catat judul + link + lisensi, lalu berikan catatannya ke AI. Musik **default mati** dan bisa dimatikan kapan saja (prinsip coherence).
