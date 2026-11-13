# Bank Soal (DRAFT): Barisan & Deret Geometri dalam Keseharian

> **Status semua soal: `draft`.** Soal **wajib diuji coba** dulu ke siswa yang diwawancara (lembar uji coba di [INSTRUMEN.md](INSTRUMEN.md) bagian C). Ubah status menjadi `diuji` lalu `siap` setelah direvisi. Hanya soal `siap` yang masuk aplikasi.
>
> Semua kunci jawaban sudah dicek dengan `python analisis/deret_geometri.py`.

Keterangan: **Proses** = Merumuskan (F) / Menggunakan (E) / Menafsirkan-Mengevaluasi (I). **Level** = perkiraan level literasi 1–6. **Beban intrinsik** = perkiraan jumlah unsur yang harus diolah bersamaan (R = rendah, S = sedang, T = tinggi).

| ID | Konteks | Proses | Level | Beban | Status |
|---|---|---|---|---|---|
| G01 | — (dasar) | E | 1 | R | draft |
| G02 | — (dasar) | F | 2 | R | draft |
| G03 | Personal: lipat kertas | E | 2 | R | draft |
| G04 | Ilmiah: bakteri | F, E | 3 | S | draft |
| G05 | Ilmiah: pantulan bola | F, E | 3 | S | draft |
| G06 | Ilmiah: obat dalam tubuh | F, E | 3 | S | draft |
| G07 | Sosial: pesan berantai | E | 3 | S | draft |
| G08 | Sosial: pesan berantai (deret) | F, E | 4 | T | draft |
| G09 | Personal: tabungan berlipat | F, E | 4 | T | draft |
| G10 | Pekerjaan: penyusutan motor | F, E | 4 | T | draft |
| G11 | — (analisis kesalahan) | I | 4 | S | draft |
| G12 | Ilmiah: eceng gondok | I | 5 | S | draft |
| G13 | Personal: memilih tawaran | F, E, I | 5 | T | draft |

---

### G01: Suku ke-n dasar
Barisan: 3, 6, 12, 24, …
a) Berapa rasionya? b) Tentukan suku ke-8.
**Kunci**: r = 2; U₈ = 3·2⁷ = **384**.
Hint: (1) Bagi suku kedua dengan suku pertama. (2) Uₙ = a·rⁿ⁻¹. (3) U₈ = 3 × 2⁷ = 3 × 128.

### G02: Mengenali barisan geometri (PG)
Manakah yang merupakan barisan geometri?
A. 2, 4, 6, 8 B. 81, 27, 9, 3 C. 1, 4, 9, 16 D. 5, 10, 16, 23
**Kunci**: **B** (r = 1/3). A = aritmetika (+2), C = bilangan kuadrat, D = selisih bertambah.

### G03: Melipat kertas
Selembar kertas dilipat menjadi dua, sehingga tebalnya 2 lapis. Jika dilipat lagi menjadi dua, tebalnya 4 lapis. Berapa lapis tebal kertas setelah dilipat 5 kali?
**Kunci**: 2⁵ = **32 lapis**.

### G04: Pembelahan bakteri
Mula-mula ada 5 bakteri. Setiap 20 menit, setiap bakteri membelah menjadi 2. Berapa banyak bakteri setelah 2 jam?
**Kunci**: 2 jam = 6 kali membelah. 5·2⁶ = **320 bakteri**. (Sebagai barisan: U₁ = 5 pada menit 0, jadi yang dicari U₇.)
Miskonsepsi yang diwaspadai: menganggap 2 jam = 2 kali membelah, atau menjawab U₆ = 160.

### G05: Pantulan bola
Sebuah bola dijatuhkan dari ketinggian 160 cm. Setiap memantul, tingginya menjadi setengah dari tinggi sebelumnya. Berapa tinggi pantulan ke-4?
**Kunci**: pantulan ke-1 = 80, ke-2 = 40, ke-3 = 20, ke-4 = **10 cm** (160·(1/2)⁴).

### G06: Obat dalam tubuh
Seorang pasien minum obat 200 mg. Setiap 4 jam, jumlah obat dalam tubuhnya tinggal setengah. Berapa mg obat yang tersisa setelah 12 jam?
**Kunci**: 12 jam = 3 periode. 200·(1/2)³ = **25 mg**.

### G07: Pesan berantai (suku)
Hari ke-1, Dina mengirim sebuah pesan ke 3 temannya. Hari berikutnya, setiap penerima mengirim ke 3 orang baru. Berapa orang yang menerima pesan **pada hari ke-4**?
**Kunci**: 3, 9, 27, 81 → **81 orang**.

### G08: Pesan berantai (deret)
Dari soal G07, berapa **total** orang yang sudah menerima pesan sampai hari ke-4?
**Kunci**: S₄ = 3(3⁴ − 1)/(3 − 1) = 3·80/2 = **120 orang**.

### G09: Tabungan berlipat
Rina menabung Rp1.000 pada hari pertama. Setiap hari, ia menabung dua kali lipat dari hari sebelumnya.
a) Berapa yang ditabung pada hari ke-7? b) Berapa total tabungannya selama 7 hari? c) Menurutmu, apakah Rina bisa terus melakukan ini sampai hari ke-30? Jelaskan.
**Kunci**: a) 1.000·2⁶ = **Rp64.000**. b) S₇ = 1.000(2⁷ − 1) = **Rp127.000**. c) Tidak realistis: hari ke-30 = 1.000·2²⁹ ≈ Rp536,9 miliar (tepatnya Rp536.870.912.000). (Bagian c adalah *evaluasi*; nilai alasan siswa.)

### G10: Penyusutan harga motor
Harga motor baru Rp20.000.000. Setiap tahun harganya turun 20% dari harga tahun sebelumnya. Berapa harga motor setelah 2 tahun?
**Kunci**: r = 0,8 → 20.000.000·0,8² = **Rp12.800.000**.
Miskonsepsi: mengurangi 20% dari harga awal dua kali (hasilnya Rp12.000.000).

### G11: Menemukan kesalahan
Andi menghitung suku ke-6 dari barisan 5, 10, 20, 40, … begini: "U₆ = 5 × 2⁶ = 320". Apakah Andi benar? Jika salah, perbaiki.
**Kunci**: Salah, seharusnya pangkat n − 1. U₆ = 5·2⁵ = **160** (cek: 5, 10, 20, 40, 80, 160).

### G12: Eceng gondok
Luas eceng gondok di sebuah kolam menjadi dua kali lipat setiap minggu. Pada minggu ke-10, kolam tertutup penuh. Pada minggu ke berapa kolam tertutup setengahnya?
**Kunci**: **minggu ke-9** (karena seminggu kemudian berlipat dua menjadi penuh). Miskonsepsi umum: menjawab minggu ke-5.

### G13: Memilih tawaran
Kamu boleh memilih hadiah selama 10 hari:
- **Tawaran A**: Rp10.000 setiap hari.
- **Tawaran B**: Rp100 pada hari pertama, lalu dua kali lipat setiap hari.
Tawaran mana yang memberi uang lebih banyak? Tunjukkan perhitunganmu.
**Kunci**: A = 10 × 10.000 = Rp100.000. B = 100(2¹⁰ − 1) = **Rp102.300**. B sedikit lebih banyak (hari ke-10 saja Rp51.200). Pengayaan: bagaimana jika hanya 9 hari? A = Rp90.000, B = Rp51.100, jadi A lebih banyak. Ini menunjukkan pertumbuhan geometri lambat di awal lalu cepat.

---

## Catatan Hasil Uji Coba (diisi setelah uji coba)
| ID | Bisa dijawab? | Persepsi (terlalu mudah/sesuai/sulit/terlalu sulit) | Waktu | Rating Paas | Bagian membingungkan | Revisi |
|---|---|---|---|---|---|---|
| G01 | | | | | | |
| G02 | | | | | | |
| … | | | | | | |

Masukkan data mentahnya ke `analisis/data/uji_coba.csv` lalu jalankan `python analisis/analisis_uji_coba.py analisis/data/uji_coba.csv`.
