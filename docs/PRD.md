# PRD — DeretKita
**Product Requirements Document**
Aplikasi pembelajaran matematika SMP untuk **mengelola beban kognitif** dan **menumbuhkan literasi matematika**, dengan materi **Barisan dan Deret Geometri dalam Kehidupan Sehari-hari**.

| Item | Keterangan |
|---|---|
| Nama kerja | **DeretKita** (boleh diganti; nama bersifat pribadi/non-komersial) |
| Pemilik | Gugun Ramdani (2225250061) — S1 Pendidikan Matematika |
| Versi dokumen | 0.1 (draft) — 13 November 2026 |
| Platform | Web (browser) + Android/iOS lewat **PWA** (bisa di-*install* langsung dari browser, **tanpa Play Store/App Store**) |
| Stack | Frontend **React + Vite (JavaScript)** · Backend analisis **Python (FastAPI)** · Database & Auth **Supabase** |

---

## 1. Latar Belakang
Hasil wawancara awal dengan siswa SMP (lihat [data-wawancara/README.md](data-wawancara/README.md)) dipakai untuk melihat **beban kognitif** siswa saat belajar matematika. Teori Beban Kognitif (*Cognitive Load Theory*, Sweller) membagi beban menjadi:

- **Intrinsik**: berasal dari tingkat kesulitan materinya sendiri (mis. memahami rasio, pangkat, rumus Uₙ = a·rⁿ⁻¹).
- **Ekstrinsik (extraneous)**: berasal dari cara penyajian yang buruk (teks terlalu panjang, gambar dan teks terpisah, informasi berlebihan). **Beban ini harus ditekan.**
- **Germane**: usaha mental yang membangun pemahaman (skema). **Beban ini perlu diarahkan.**

Selain itu, siswa Indonesia masih lemah dalam **literasi matematika** (kerangka PISA): merumuskan masalah nyata ke bentuk matematika, menggunakan konsep, lalu menafsirkan dan mengevaluasi hasilnya. Materi barisan & deret geometri cocok untuk ini karena banyak konteks sehari-hari (pembelahan bakteri, pesan berantai, pantulan bola, penyusutan harga, tabungan berlipat).

> ⚠️ **Temuan wawancara**: isi bagian ini setelah transkrip dianalisis (keluhan utama siswa, bagian yang membuat bingung, gaya belajar yang disukai, perangkat HP yang dipakai).
> - Temuan 1: …
> - Temuan 2: …
> - Temuan 3: …

## 2. Tujuan Produk
1. **Menurunkan beban kognitif ekstrinsik** saat siswa mempelajari barisan & deret geometri.
2. **Mengelola beban intrinsik** lewat penyajian bertahap (segmenting, pre-training, worked example → latihan mandiri).
3. **Menumbuhkan literasi matematika** dengan soal konteks nyata mengikuti proses *Merumuskan → Menggunakan → Menafsirkan/Mengevaluasi*.
4. **Mengukur** beban kognitif dan hasil belajar sebagai data penelitian (dianalisis dengan **Python**).
5. **Bisa dibuka di HP siswa** (ringan, mobile-first, bisa dipakai offline setelah dibuka sekali).

### Indikator keberhasilan (KPI penelitian)
| Indikator | Target awal |
|---|---|
| Skor rata-rata beban mental (skala Paas 1–9) per soal | ≤ 5 (sedang) |
| Skor beban ekstrinsik (angket Leppink) | turun dibanding pembelajaran biasa |
| Ketuntasan tes literasi geometri | ≥ 70% siswa mencapai KKTP |
| Skor kegunaan aplikasi (SUS) | ≥ 68 (kategori *acceptable*) |
| Aplikasi bisa di-*install* & jalan di Android kelas menengah ke bawah | 100% uji perangkat lolos |

## 3. Pengguna (Persona)
| Persona | Kebutuhan |
|---|---|
| **Siswa SMP (kelas VIII/IX)**, punya HP Android sendiri/berbagi, kuota terbatas | Materi singkat, jelas, tidak membingungkan, bisa diulang, ada petunjuk |
| **Guru Matematika** | Melihat progres kelas, soal mana yang sulit, data beban kognitif |
| **Peneliti (Gugun)** | Mengunduh data jawaban, waktu, rating beban, untuk dianalisis dengan Python |

## 4. Ruang Lingkup Materi
Tujuan pembelajaran (sesuaikan dengan Kurikulum Merdeka Fase D / kurikulum sekolah; **cek ke guru pamong**):
1. Mengenali pola **barisan geometri** dari situasi sehari-hari (ada pengali tetap/rasio).
2. Menentukan **rasio (r)** dan **suku ke-n**: Uₙ = a · rⁿ⁻¹.
3. Menentukan **jumlah n suku pertama (deret)**: Sₙ = a(rⁿ − 1)/(r − 1) untuk r > 1, Sₙ = a(1 − rⁿ)/(1 − r) untuk r < 1.
4. Membedakan pola geometri (dikali) dan aritmetika (ditambah).
5. **Literasi**: memodelkan masalah nyata, menghitung, dan menilai apakah hasilnya masuk akal.

Di luar cakupan v1: deret geometri tak hingga (hanya jadi materi pengayaan opsional).

Rincian materi & konteks: [CONTENT_DESIGN.md](CONTENT_DESIGN.md). Draft soal: [BANK_SOAL_DRAFT.md](BANK_SOAL_DRAFT.md).

## 5. Fitur

### 5.1 MVP (wajib ada untuk uji coba)
| ID | Fitur | Deskripsi | Prinsip CLT / Literasi |
|---|---|---|---|
| F1 | **Login sederhana** | Siswa masuk dengan kode kelas + nama panggilan (tanpa email). Guru/peneliti login email (Supabase Auth). | Mengurangi hambatan awal |
| F2 | **Pre-training** | Kartu kosakata singkat: suku, rasio, barisan, deret, pangkat. | *Pre-training principle* |
| F3 | **Materi bertahap (segmen)** | Satu layar = satu ide. Tombol "Lanjut" diatur siswa sendiri. | *Segmenting*, *learner pacing* |
| F4 | **Contoh soal terurai (worked example)** | Langkah demi langkah, lalu langkahnya pelan-pelan dihilangkan (*fading*). | *Worked example*, *fading* |
| F5 | **Visual + teks menyatu** | Animasi pembelahan bakteri/pantulan bola, label langsung di gambar. | *Spatial contiguity*, *signaling* |
| F6 | **Latihan literasi** | Soal konteks dengan tahap: Pahami → Modelkan → Hitung → Periksa masuk akal. | Proses literasi PISA |
| F7 | **Petunjuk bertingkat** | Hint 1 (arah) → Hint 2 (rumus) → Hint 3 (langkah). Penggunaan hint dicatat. | Menahan beban intrinsik |
| F8 | **Rating beban mental** | Setelah tiap soal: "Seberapa besar usahamu?" skala 1–9 (Paas). | Pengukuran CLT |
| F9 | **Kalkulator pola mini** | Masukkan a dan r → aplikasi menampilkan barisan & grafik. | Eksplorasi |
| F10 | **Progres siswa** | Bintang/lencana per modul, ringkasan bagian yang perlu diulang. | Motivasi |
| F11 | **PWA installable + offline** | Tombol "Pasang Aplikasi" dan materi tersimpan di HP. | Akses tanpa Play Store |
| F12 | **Dasbor guru/peneliti** | Tabel progres, soal tersulit, rata-rata beban, ekspor CSV. | Data penelitian |

### 5.2 Fase lanjut (Nice to have)
- Mode **refleksi**: siswa menulis/merekam "aku belajar…" (*self-explanation*).
- **Analisis Python** otomatis di server: indeks kesukaran soal, korelasi beban dan skor, grafik.
- Musik latar opsional (bisa dimatikan, default **mati** karena suara bisa menambah beban ekstrinsik).
- Tema warna gelap/terang, ukuran huruf besar.
- Bungkus PWA menjadi file **APK** (TWA/Capacitor) untuk dibagikan langsung (*sideload*), tetap tanpa Play Store.

## 6. Kebutuhan Non-Fungsional
| Aspek | Kebutuhan |
|---|---|
| Kinerja | Halaman pertama < 3 detik di 4G; ukuran bundle awal < 300 KB (gzip) |
| Perangkat | Mulus di Android 8+ RAM 2 GB, layar 360 px |
| Offline | Materi & soal yang sudah dibuka bisa diakses tanpa internet; jawaban disinkron saat online |
| Aksesibilitas | Kontras cukup, huruf ≥ 16 px, tombol ≥ 44 px, bisa diperbesar |
| Bahasa | Bahasa Indonesia baku sederhana, kalimat pendek |
| Privasi | Data siswa anonim (kode siswa), tidak ada nama lengkap/nomor HP. Izin orang tua/sekolah untuk penelitian |
| Keamanan | Supabase Row Level Security (RLS): siswa hanya bisa melihat datanya sendiri |

## 7. Alur Pengguna (Siswa)
```
Buka link / ikon aplikasi
  → Masuk (kode kelas + nama panggilan)
  → Beranda: daftar modul + progres
  → Modul: Pre-training → Materi segmen → Worked example → Latihan (fading)
      → tiap soal: jawab → umpan balik → rating beban (1–9)
  → Tantangan Literasi (soal konteks)
  → Ringkasan & refleksi
```

## 8. Analisis Aplikasi Pembanding (reverse engineering, untuk keperluan pribadi)
Pelajari aplikasi yang sudah ada **hanya untuk mencari ide pola desain**, bukan untuk menyalin aset/merek.
| Aplikasi | Yang dipelajari | Yang dihindari |
|---|---|---|
| Duolingo | Sesi pendek, progres jelas, umpan balik instan | Gamifikasi berlebihan |
| Khan Academy | Hint bertingkat, video + latihan | Teks panjang |
| Photomath | Langkah penyelesaian terurai | Siswa hanya menyalin jawaban |
| GeoGebra | Visual interaktif | Antarmuka terlalu rumit untuk SMP |

Isi tabel ini lagi setelah mencoba aplikasinya langsung.

## 9. Riset & Validasi
1. **Instrumen** disusun: [INSTRUMEN.md](INSTRUMEN.md).
2. **Draft soal diuji coba** dulu ke siswa yang diwawancara (think-aloud) → dinilai: *bisa dijawab? susah? terlalu mudah?* → direvisi → **baru dimasukkan ke aplikasi**.
3. Validasi ahli materi & ahli media.
4. Uji coba kelompok kecil → uji lapangan.
5. Analisis data dengan Python: [../analisis/](../analisis/).

## 10. Risiko
| Risiko | Mitigasi |
|---|---|
| Internet siswa lemah | PWA offline, aset kecil |
| HP siswa lambat | Animasi ringan (CSS/SVG/Lottie kecil), bukan video berat |
| Soal tidak sesuai kemampuan | Uji coba soal sebelum dimasukkan |
| Kuota AI habis saat mengoding | Kerjakan per tugas kecil, simpan catatan progres ([CATATAN_PROGRES.md](CATATAN_PROGRES.md)) |
| Hak cipta lagu/gambar | Gunakan aset bebas royalti / buatan sendiri (Canva) dan catat sumbernya |

## 11. Jadwal Ringkas
Lihat [ROADMAP.md](ROADMAP.md).
