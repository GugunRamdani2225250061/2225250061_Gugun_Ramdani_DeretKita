// Bank soal aplikasi. ID G.. sama dengan docs/BANK_SOAL_DRAFT.md; P.. = soal cek singkat.
// status: 'draft' (belum diuji coba) | 'diuji' | 'siap'. Ubah setelah uji coba ke siswa.
//
// Setiap soal terdiri dari beberapa "bagian" (langkah literasi: Pahami, Modelkan, Hitung, Periksa).
// tipe 'pg'    : opsi [...], kunci = indeks opsi yang benar, salah = { indeks: umpan balik }
// tipe 'isian' : kunci = angka, satuan, salah = { "angka salah umum": umpan balik }
// Markup teks: [a:..] biru (suku pertama), [r:..] oranye (rasio), [n:..] hijau (urutan), **tebal**

export const SOAL = {
  // ---------------- M0: Pre-training ----------------
  P01: {
    judul: 'Cek pangkat', status: 'draft',
    bagian: [{
      tanya: 'Berapakah 2³ ?', tipe: 'isian', kunci: 8,
      hints: ['Pangkat 3 berarti bilangan itu dikali dengan dirinya sendiri sebanyak 3 kali.', '2³ = 2 × 2 × 2'],
      salah: { 6: '2³ artinya 2 × 2 × 2, **bukan** 2 × 3.', 5: '2³ bukan 2 + 3. Pangkat berarti perkalian berulang.' },
      bahas: '2³ = 2 × 2 × 2 = 8',
    }],
  },
  P02: {
    judul: 'Cek suku', status: 'draft',
    bagian: [{
      tanya: 'Pada barisan 4, 8, 16, 32, manakah **suku ke-3** (U₃)?', tipe: 'pg',
      opsi: ['4', '8', '16', '32'], kunci: 2,
      hints: ['Hitung dari kiri: suku ke-1, suku ke-2, suku ke-3.'],
      salah: { 1: '8 adalah suku ke-2. Suku ke-1 = 4.' },
      bahas: 'U₁ = 4, U₂ = 8, U₃ = 16.',
    }],
  },

  // ---------------- M1: Pola yang dikali ----------------
  G02: {
    judul: 'Mengenali barisan geometri', status: 'draft', level: 2, konteks: 'Dasar',
    bagian: [
      {
        tahap: 'Pahami', tanya: 'Manakah yang merupakan **barisan geometri**?', tipe: 'pg',
        opsi: ['2, 4, 6, 8', '81, 27, 9, 3', '1, 4, 9, 16', '5, 10, 16, 23'], kunci: 1,
        hints: ['Barisan geometri: setiap suku diperoleh dari suku sebelumnya **dikali** bilangan yang sama.', 'Coba bagi setiap suku dengan suku sebelumnya. Hasilnya harus selalu sama.'],
        salah: {
          0: '2, 4, 6, 8 selalu **ditambah** 2. Itu barisan aritmetika.',
          2: '1, 4, 9, 16 adalah bilangan kuadrat (1², 2², 3², 4²). Hasil baginya tidak tetap.',
          3: 'Selisihnya 5, 6, 7 dan hasil baginya juga tidak tetap.',
        },
        bahas: '81 : 27 = 3, 27 : 9 = 3, 9 : 3 = 3. Setiap suku dikali ⅓ (atau dibagi 3).',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa **rasio** barisan 81, 27, 9, 3?', tipe: 'pg',
        opsi: ['3', '−3', '1/3', '27'], kunci: 2,
        hints: ['Rasio = U₂ : U₁', '27 : 81 = ?'],
        salah: { 0: 'Barisannya **mengecil**, jadi rasionya kurang dari 1. Hitung U₂ : U₁ = 27 : 81.' },
        bahas: 'r = 27 : 81 = 1/3. Barisan mengecil karena 0 < r < 1.',
      },
    ],
  },
  G03: {
    judul: 'Melipat kertas', status: 'draft', level: 2, konteks: 'Personal',
    cerita: 'Selembar kertas dilipat menjadi dua sehingga tebalnya 2 lapis. Jika dilipat lagi menjadi dua, tebalnya 4 lapis.',
    visual: { tipe: 'lipat', langkah: 3 },
    bagian: [
      {
        tahap: 'Pahami', tanya: 'Berapa lapis setelah dilipat **3 kali**?', tipe: 'isian', kunci: 8, satuan: 'lapis',
        hints: ['Setiap dilipat, banyak lapisan menjadi **dua kali lipat**.', '2 → 4 → ?'],
        salah: { 6: 'Lapisan bukan ditambah 2, tetapi **dikali 2** setiap lipatan.' },
        bahas: '2 × 2 × 2 = 2³ = 8 lapis.',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa lapis setelah dilipat **5 kali**?', tipe: 'isian', kunci: 32, satuan: 'lapis',
        hints: ['Lanjutkan pola: 2, 4, 8, …', 'Banyak lapis = 2⁵'],
        salah: { 10: 'Itu 2 × 5. Seharusnya 2 dikali dengan dirinya sendiri 5 kali: 2⁵.', 16: '16 lapis adalah hasil 4 kali lipatan. Tambah satu lipatan lagi.', 64: '64 lapis adalah hasil 6 kali lipatan.' },
        bahas: '2, 4, 8, 16, 32. Jadi 2⁵ = 32 lapis.',
      },
    ],
  },

  // ---------------- M2: Suku ke-n ----------------
  G01: {
    judul: 'Suku ke-8', status: 'draft', level: 1, konteks: 'Dasar',
    cerita: 'Barisan: 3, 6, 12, 24, …',
    bagian: [
      {
        tahap: 'Modelkan', tanya: 'Berapa **rasio** (r) barisan ini?', tipe: 'isian', kunci: 2,
        hints: ['Rasio = suku ke-2 dibagi suku ke-1.', 'r = 6 : 3'],
        salah: { 3: 'Selisih 6 − 3 = 3, tetapi barisan geometri memakai **hasil bagi**, bukan selisih.' },
        bahas: 'r = 6 : 3 = 2',
      },
      {
        tahap: 'Hitung', tanya: 'Tentukan **suku ke-8** (U₈).', tipe: 'isian', kunci: 384,
        hints: ['Uₙ = a · rⁿ⁻¹, dengan a = 3, r = 2, n = 8.', 'U₈ = 3 × 2⁷ = 3 × 128'],
        salah: { 768: 'Kamu memakai 3 × 2⁸. Ingat pangkatnya **n − 1** = 7.', 48: 'Pangkatnya kurang. U₈ = 3 × 2⁷.', 24: 'Itu suku ke-4. Lanjutkan sampai suku ke-8.' },
        bahas: 'U₈ = 3 × 2⁷ = 3 × 128 = 384',
      },
    ],
  },
  G11: {
    judul: 'Menemukan kesalahan', status: 'draft', level: 4, konteks: 'Penalaran',
    cerita: 'Andi menghitung suku ke-6 dari barisan 5, 10, 20, 40, … seperti ini:\n"U₆ = 5 × 2⁶ = 320"',
    bagian: [
      {
        tahap: 'Periksa', tanya: 'Apakah cara Andi benar?', tipe: 'pg',
        opsi: ['Benar', 'Salah, pangkatnya seharusnya 5', 'Salah, rasionya seharusnya 5', 'Salah, seharusnya ditambah, bukan dikali'], kunci: 1,
        hints: ['Coba tulis barisannya sampai suku ke-6: 5, 10, 20, 40, …', 'Suku pertama belum dikali, jadi pangkatnya n − 1.'],
        salah: { 0: 'Coba cek manual: 5, 10, 20, 40, 80, ? Apakah suku ke-6 = 320?', 2: 'Rasio = 10 : 5 = 2. Rasionya sudah benar.' },
        bahas: 'Pangkatnya n − 1 = 6 − 1 = 5, bukan 6.',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa nilai U₆ yang benar?', tipe: 'isian', kunci: 160,
        hints: ['U₆ = 5 × 2⁵', '2⁵ = 32'],
        salah: { 320: 'Itu jawaban Andi yang salah. Pakai pangkat 5.' },
        bahas: 'U₆ = 5 × 2⁵ = 5 × 32 = 160. Cek: 5, 10, 20, 40, 80, 160 ✔',
      },
    ],
  },
  G04: {
    judul: 'Pembelahan bakteri', status: 'draft', level: 3, konteks: 'Ilmiah',
    cerita: 'Mula-mula ada 5 bakteri. Setiap 20 menit, setiap bakteri membelah menjadi 2. Berapa banyak bakteri setelah 2 jam?',
    visual: { tipe: 'titik', awal: 5, rasio: 2, langkah: 2, satuan: 'bakteri' },
    bagian: [
      {
        tahap: 'Pahami', tanya: 'Dalam 2 jam, berapa kali bakteri membelah?', tipe: 'isian', kunci: 6, satuan: 'kali',
        hints: ['Ubah 2 jam menjadi menit.', '2 jam = 120 menit. Bakteri membelah setiap 20 menit, jadi 120 : 20 = ?'],
        salah: { 2: '2 jam = 120 menit, bukan 2 kali membelah. Hitung 120 : 20.', 120: '120 itu banyak menitnya. Bakteri membelah setiap 20 menit.', 40: 'Bakteri membelah setiap 20 menit, jadi bagilah: 120 : 20.' },
        bahas: '120 menit : 20 menit = 6 kali membelah.',
      },
      {
        tahap: 'Modelkan', tanya: 'Model matematika yang tepat adalah …', tipe: 'pg',
        opsi: ['5 + 2 × 6', '5 × 2⁶', '5 × 6²', '2 × 5⁶'], kunci: 1,
        hints: ['Setiap membelah, banyak bakteri **dikali 2**. Ada 6 kali membelah.', 'Awalnya 5, lalu dikali 2 sebanyak 6 kali.'],
        salah: { 0: 'Bakteri tidak bertambah 2, tetapi berlipat **dua kali**.', 2: 'Yang dipangkatkan adalah pengalinya (2), sebanyak 6 kali.' },
        bahas: 'a = 5, r = 2, dikali 6 kali: 5 × 2⁶.',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa banyak bakteri setelah 2 jam?', tipe: 'isian', kunci: 320, satuan: 'bakteri',
        hints: ['2⁶ = 64', '5 × 64 = ?'],
        salah: { 160: 'Itu baru 5 kali membelah (setelah 100 menit). Dalam 2 jam bakteri membelah 6 kali.', 640: 'Itu 7 kali membelah. Dalam 2 jam bakteri membelah 6 kali.', 60: '5 × 2 × 6 bukan model yang tepat. Pembelahan berarti dikali 2 berulang kali.' },
        bahas: '5 × 2⁶ = 5 × 64 = 320 bakteri.',
      },
      {
        tahap: 'Periksa', tanya: 'Apakah hasil 320 bakteri masuk akal?', tipe: 'pg',
        opsi: ['Ya, karena bakteri berlipat ganda sehingga cepat bertambah banyak', 'Tidak, seharusnya jumlahnya berkurang', 'Tidak, seharusnya hanya 5 × 6 = 30'], kunci: 0,
        hints: ['Bayangkan: 5 → 10 → 20 → 40 → …'],
        bahas: 'Pertumbuhan geometri bertambah sangat cepat: 5, 10, 20, 40, 80, 160, 320.',
      },
    ],
  },

  // ---------------- M3: Pola yang mengecil ----------------
  G05: {
    judul: 'Pantulan bola', status: 'draft', level: 3, konteks: 'Ilmiah',
    cerita: 'Sebuah bola dijatuhkan dari ketinggian 160 cm. Setiap memantul, tingginya menjadi setengah dari tinggi sebelumnya.',
    visual: { tipe: 'bola', tinggi: 160, rasio: 0.5, langkah: 2 },
    bagian: [
      {
        tahap: 'Modelkan', tanya: 'Tinggi pantulan membesar atau mengecil? Berapa rasionya?', tipe: 'pg',
        opsi: ['Membesar, r = 2', 'Mengecil, r = ½', 'Mengecil, r = 2', 'Tetap, r = 1'], kunci: 1,
        hints: ['"Setengah dari tinggi sebelumnya" artinya dikali ½.'],
        salah: { 2: 'Jika dikali 2, bolanya makin tinggi. Setengah berarti dikali ½.' },
        bahas: 'Mengecil dengan r = ½: 160, 80, 40, …',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa tinggi **pantulan ke-4**?', tipe: 'isian', kunci: 10, satuan: 'cm',
        hints: ['Pantulan ke-1 = 80 cm, pantulan ke-2 = 40 cm, …', '160 × (½)⁴ = 160 : 16'],
        salah: { 20: '20 cm adalah pantulan ke-3. Lanjutkan satu kali lagi.', 5: '5 cm adalah pantulan ke-5.', 40: '40 cm adalah pantulan ke-2.' },
        bahas: '80, 40, 20, 10. Jadi pantulan ke-4 setinggi 10 cm.',
      },
    ],
  },
  G06: {
    judul: 'Obat dalam tubuh', status: 'draft', level: 3, konteks: 'Ilmiah',
    cerita: 'Seorang pasien minum obat 200 mg. Setiap 4 jam, jumlah obat dalam tubuhnya tinggal setengah.',
    bagian: [
      {
        tahap: 'Pahami', tanya: '12 jam sama dengan berapa kali periode 4 jam?', tipe: 'isian', kunci: 3, satuan: 'kali',
        hints: ['12 : 4 = ?'],
        bahas: '12 : 4 = 3 periode.',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa mg obat yang tersisa setelah 12 jam?', tipe: 'isian', kunci: 25, satuan: 'mg',
        hints: ['Setiap periode, obat dikali ½.', '200 × (½)³ = 200 : 8'],
        salah: { 50: '50 mg adalah sisa setelah 8 jam (2 periode).', 12.5: '12,5 mg adalah sisa setelah 16 jam.', 100: '100 mg adalah sisa setelah 4 jam.', 194: 'Obat tidak berkurang 2 mg tiap periode, tetapi tinggal setengahnya.' },
        bahas: '200 → 100 → 50 → 25 mg.',
      },
    ],
  },
  G10: {
    judul: 'Penyusutan harga motor', status: 'draft', level: 4, konteks: 'Pekerjaan',
    cerita: 'Harga motor baru Rp20.000.000. Setiap tahun, harganya turun 20% dari harga tahun sebelumnya.',
    bagian: [
      {
        tahap: 'Pahami', tanya: 'Turun 20% setiap tahun berarti harga tahun berikutnya adalah …', tipe: 'pg',
        opsi: ['20% dari harga awal', '80% dari harga tahun sebelumnya', 'harga sebelumnya dikurangi Rp20.000', '120% dari harga tahun sebelumnya'], kunci: 1,
        hints: ['Jika turun 20%, berapa persen yang tersisa?', '100% − 20% = ?'],
        bahas: '100% − 20% = 80% dari harga tahun sebelumnya.',
      },
      {
        tahap: 'Modelkan', tanya: 'Berapa rasionya (r)?', tipe: 'pg',
        opsi: ['0,2', '0,8', '1,2', '20'], kunci: 1,
        hints: ['80% = 80/100'],
        salah: { 0: '0,2 adalah bagian yang **hilang**. Rasio adalah bagian yang **tersisa**.' },
        bahas: 'r = 80% = 0,8',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa harga motor setelah 2 tahun? (tulis dalam rupiah)', tipe: 'isian', kunci: 12800000, satuan: 'rupiah',
        hints: ['Tahun ke-1: 20.000.000 × 0,8 = 16.000.000', 'Tahun ke-2: 16.000.000 × 0,8 = ?'],
        salah: { 12000000: 'Kamu mengurangi 20% dari harga **awal** dua kali. Pada tahun ke-2, 20% dihitung dari Rp16.000.000.', 16000000: 'Itu harga setelah 1 tahun.' },
        bahas: '20.000.000 × 0,8² = 20.000.000 × 0,64 = Rp12.800.000',
      },
      {
        tahap: 'Periksa', tanya: 'Mengapa penurunan pada tahun ke-2 (Rp3.200.000) lebih kecil dari tahun ke-1 (Rp4.000.000)?', tipe: 'pg',
        opsi: ['Karena 20% dihitung dari harga yang sudah turun', 'Karena persennya berubah menjadi 10%', 'Karena motornya rusak'], kunci: 0,
        bahas: '20% dari Rp16.000.000 lebih kecil daripada 20% dari Rp20.000.000.',
      },
    ],
  },

  // ---------------- M4: Deret ----------------
  G07: {
    judul: 'Pesan berantai', status: 'draft', level: 3, konteks: 'Sosial',
    cerita: 'Hari ke-1, Dina mengirim sebuah pesan ke 3 temannya. Hari berikutnya, setiap penerima mengirim pesan itu ke 3 orang baru.',
    visual: { tipe: 'titik', awal: 3, rasio: 3, langkah: 2, satuan: 'orang' },
    bagian: [
      {
        tahap: 'Hitung', tanya: 'Berapa orang yang menerima pesan **pada hari ke-4**?', tipe: 'isian', kunci: 81, satuan: 'orang',
        hints: ['Hari ke-1: 3, hari ke-2: 9, hari ke-3: 27, …', 'U₄ = 3 × 3³'],
        salah: { 12: 'Kalau ditambah 3 tiap hari, hasilnya 12. Tetapi penerima **dikali 3** setiap hari.', 27: '27 orang adalah penerima hari ke-3.', 120: '120 adalah **total** sampai hari ke-4. Yang ditanya hanya hari ke-4.' },
        bahas: '3, 9, 27, 81. Jadi 81 orang.',
      },
    ],
  },
  G08: {
    judul: 'Total penerima pesan', status: 'draft', level: 4, konteks: 'Sosial',
    cerita: 'Masih tentang pesan berantai Dina: 3 penerima pada hari ke-1, lalu setiap penerima meneruskan ke 3 orang baru.',
    bagian: [
      {
        tahap: 'Pahami', tanya: 'Kali ini yang ditanya adalah **total** penerima sampai hari ke-4. Artinya kita mencari …', tipe: 'pg',
        opsi: ['penerima pada hari ke-4 saja (U₄)', 'jumlah penerima hari ke-1 sampai ke-4 (S₄)', 'rasio pesan'], kunci: 1,
        hints: ['"Total" berarti dijumlahkan.'],
        bahas: 'Total = deret: S₄ = U₁ + U₂ + U₃ + U₄.',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa total orang yang sudah menerima pesan sampai hari ke-4?', tipe: 'isian', kunci: 120, satuan: 'orang',
        hints: ['3 + 9 + 27 + 81', 'Atau pakai Sₙ = a(rⁿ − 1) : (r − 1) = 3(3⁴ − 1) : 2'],
        salah: { 81: '81 hanya penerima hari ke-4. Jumlahkan semua hari.', 121: 'Dina adalah pengirim, bukan penerima.', 39: 'Itu jumlah sampai hari ke-3. Tambahkan hari ke-4.' },
        bahas: '3 + 9 + 27 + 81 = 120 orang.',
      },
    ],
  },
  G09: {
    judul: 'Tabungan berlipat', status: 'draft', level: 4, konteks: 'Personal',
    cerita: 'Rina menabung Rp1.000 pada hari pertama. Setiap hari, ia menabung dua kali lipat dari hari sebelumnya.',
    bagian: [
      {
        tahap: 'Hitung', tanya: 'Berapa yang ditabung Rina **pada hari ke-7**?', tipe: 'isian', kunci: 64000, satuan: 'rupiah',
        hints: ['a = 1.000, r = 2, n = 7', 'U₇ = 1.000 × 2⁶'],
        salah: { 128000: 'Itu hari ke-8. U₇ = 1.000 × 2⁶.', 7000: 'Tabungannya bukan ditambah Rp1.000, tetapi **dua kali lipat**.', 14000: 'Itu 1.000 × 2 × 7. Seharusnya 2 dipangkatkan: 2⁶.', 32000: 'Itu hari ke-6.' },
        bahas: '1.000 × 2⁶ = 1.000 × 64 = Rp64.000',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa **total** tabungan Rina selama 7 hari?', tipe: 'isian', kunci: 127000, satuan: 'rupiah',
        hints: ['Total = deret, pakai Sₙ.', 'S₇ = 1.000 × (2⁷ − 1) : (2 − 1) = 1.000 × (128 − 1)'],
        salah: { 64000: 'Itu tabungan hari ke-7 saja. Yang ditanya total 7 hari.', 128000: 'Hampir! S₇ = 1.000 × (2⁷ − 1) = 1.000 × 127.' },
        bahas: '1.000 + 2.000 + 4.000 + 8.000 + 16.000 + 32.000 + 64.000 = Rp127.000',
      },
      {
        tahap: 'Periksa', tanya: 'Apakah Rina bisa terus melakukannya sampai hari ke-30?', tipe: 'pg',
        opsi: ['Bisa, karena hanya dikali 2', 'Tidak realistis, karena pada hari ke-30 ia harus menabung lebih dari Rp500 miliar', 'Bisa, karena totalnya hanya Rp30.000'], kunci: 1,
        hints: ['Hitung kira-kira: U₃₀ = 1.000 × 2²⁹. Gunakan Kalkulator Pola jika perlu.'],
        bahas: 'U₃₀ = 1.000 × 2²⁹ = Rp536.870.912.000. Pertumbuhan geometri sangat cepat, jadi tidak mungkin dilakukan.',
      },
    ],
  },

  // ---------------- M5: Geometri vs aritmetika ----------------
  P03: {
    judul: 'Jenis barisan (1)', status: 'draft',
    bagian: [{
      tanya: '3, 7, 11, 15, … termasuk barisan apa?', tipe: 'pg',
      opsi: ['Aritmetika (selalu ditambah 4)', 'Geometri (selalu dikali 4)', 'Bukan keduanya'], kunci: 0,
      hints: ['Hitung selisihnya: 7 − 3, 11 − 7, 15 − 11.'],
      salah: { 1: '3 × 4 = 12, bukan 7. Coba hitung selisihnya.' },
      bahas: 'Selisihnya selalu 4, jadi barisan aritmetika.',
    }],
  },
  P04: {
    judul: 'Jenis barisan (2)', status: 'draft',
    bagian: [{
      tanya: '2, 6, 18, 54, … termasuk barisan apa?', tipe: 'pg',
      opsi: ['Aritmetika (selalu ditambah 4)', 'Geometri (selalu dikali 3)', 'Bukan keduanya'], kunci: 1,
      hints: ['Selisihnya 4, 12, 36, tidak sama. Coba hitung hasil baginya.'],
      salah: { 0: '6 + 4 = 10, bukan 18. Selisihnya tidak tetap.' },
      bahas: '6 : 2 = 18 : 6 = 54 : 18 = 3. Barisan geometri dengan r = 3.',
    }],
  },
  P05: {
    judul: 'Jenis barisan (3)', status: 'draft',
    bagian: [{
      tanya: '1, 2, 4, 7, 11, … termasuk barisan apa?', tipe: 'pg',
      opsi: ['Aritmetika', 'Geometri', 'Bukan keduanya'], kunci: 2,
      hints: ['Selisihnya: 1, 2, 3, 4. Apakah tetap?', 'Hasil baginya: 2, 2, 1,75, … Apakah tetap?'],
      salah: { 1: '1, 2, 4 terlihat dikali 2, tetapi 4 × 2 = 8, bukan 7.' },
      bahas: 'Selisihnya bertambah (+1, +2, +3, +4) dan hasil baginya tidak tetap.',
    }],
  },

  // ---------------- M6: Tantangan literasi ----------------
  G12: {
    judul: 'Eceng gondok', status: 'draft', level: 5, konteks: 'Ilmiah',
    cerita: 'Luas eceng gondok di sebuah kolam menjadi dua kali lipat setiap minggu. Pada minggu ke-10, kolam tertutup penuh.',
    bagian: [
      {
        tahap: 'Periksa', tanya: 'Pada minggu ke berapa kolam tertutup **setengahnya**?', tipe: 'pg',
        opsi: ['Minggu ke-5', 'Minggu ke-9', 'Minggu ke-8', 'Minggu ke-1'], kunci: 1,
        hints: ['Berpikirlah mundur dari minggu ke-10.', 'Jika minggu ke-9 tertutup ½, seminggu kemudian menjadi ½ × 2 = …'],
        salah: { 0: 'Setengah waktu tidak sama dengan setengah luas. Luasnya **berlipat dua** tiap minggu, jadi mundur 1 minggu = setengahnya.' },
        bahas: 'Minggu ke-9: ½ kolam → minggu ke-10: ½ × 2 = penuh.',
      },
      {
        tahap: 'Periksa', tanya: 'Pada minggu ke-8, berapa bagian kolam yang tertutup?', tipe: 'pg',
        opsi: ['1/2', '1/4', '1/8', '8/10'], kunci: 1,
        hints: ['Mundur 2 minggu dari penuh: penuh → ½ → ?'],
        salah: { 3: 'Pertumbuhannya dikali, bukan bertambah tetap setiap minggu.' },
        bahas: 'Minggu ke-10: 1, minggu ke-9: ½, minggu ke-8: ¼.',
      },
    ],
  },
  G13: {
    judul: 'Memilih tawaran', status: 'draft', level: 5, konteks: 'Personal',
    cerita: 'Kamu boleh memilih hadiah selama 10 hari.\nTawaran A: Rp10.000 setiap hari.\nTawaran B: Rp100 pada hari pertama, lalu dua kali lipat setiap hari.',
    bagian: [
      {
        tahap: 'Modelkan', tanya: 'Tawaran B adalah barisan …', tipe: 'pg',
        opsi: ['Aritmetika dengan a = 100, beda 100', 'Geometri dengan a = 100, r = 2', 'Geometri dengan a = 10.000, r = 2'], kunci: 1,
        hints: ['"Dua kali lipat" berarti dikali 2.'],
        bahas: 'B: 100, 200, 400, … (a = 100, r = 2).',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa total uang dari **Tawaran A** selama 10 hari?', tipe: 'isian', kunci: 100000, satuan: 'rupiah',
        hints: ['10 hari × Rp10.000'],
        bahas: '10 × 10.000 = Rp100.000',
      },
      {
        tahap: 'Hitung', tanya: 'Berapa total uang dari **Tawaran B** selama 10 hari?', tipe: 'isian', kunci: 102300, satuan: 'rupiah',
        hints: ['Pakai Sₙ = a(rⁿ − 1) : (r − 1) dengan a = 100, r = 2, n = 10.', '2¹⁰ = 1.024, jadi S₁₀ = 100 × (1.024 − 1)'],
        salah: { 51200: 'Itu uang hari ke-10 saja. Jumlahkan semua hari (Sₙ).', 102400: 'Hampir! 100 × (2¹⁰ − 1) = 100 × 1.023.' },
        bahas: 'S₁₀ = 100 × (1.024 − 1) = Rp102.300. B sedikit lebih banyak dari A.',
      },
      {
        tahap: 'Periksa', tanya: 'Jika hadiah hanya **9 hari**, tawaran mana yang lebih banyak?', tipe: 'pg',
        opsi: ['Tawaran A', 'Tawaran B', 'Sama banyak'], kunci: 0,
        hints: ['A: 9 × 10.000. B: 100 × (2⁹ − 1).'],
        salah: { 1: 'Hitung: B selama 9 hari = 100 × 511 = Rp51.100, sedangkan A = Rp90.000.' },
        bahas: 'A = Rp90.000, B = Rp51.100. Pertumbuhan geometri lambat di awal, lalu sangat cepat di akhir.',
      },
    ],
  },
}
