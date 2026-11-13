// Materi per modul. Prinsip: 1 layar = 1 ide, teks pendek, label menyatu dengan gambar.
// jenis segmen: 'kartu' (pre-training), 'materi', 'contoh' (worked example; langkah dengan `kosong` = fading)
// Markup teks: [a:..] biru, [r:..] oranye, [n:..] hijau, **tebal**, baris baru = \n

export const MODUL = [
  {
    id: 'M0', judul: 'Kenali Istilah', ringkas: 'Kosakata penting sebelum mulai', menit: 5,
    segmen: [
      { jenis: 'kartu', judul: 'Barisan', teks: 'Barisan adalah bilangan yang disusun **berurutan** mengikuti aturan tertentu.', contoh: '2, 4, 8, 16, …' },
      { jenis: 'kartu', judul: 'Suku', teks: 'Setiap bilangan dalam barisan disebut **suku**. Suku ke-1 ditulis U₁, suku ke-2 ditulis U₂, dan seterusnya.', contoh: 'Pada 2, 4, 8, 16: U₁ = 2 dan U₃ = 8' },
      { jenis: 'kartu', judul: 'Pangkat', teks: '2³ artinya 2 dikali dengan dirinya sendiri sebanyak **3 kali**.', contoh: '2³ = 2 × 2 × 2 = 8 (bukan 2 × 3)' },
      { jenis: 'kartu', judul: 'Rasio', teks: '[r:Rasio] adalah **pengali tetap** dari satu suku ke suku berikutnya. Simbolnya [r:r].', contoh: '2, 4, 8, 16 → selalu ×2, jadi r = 2' },
      { jenis: 'kartu', judul: 'Deret', teks: '**Deret** adalah hasil penjumlahan suku-suku sebuah barisan.', contoh: '2 + 4 + 8 + 16 = 30' },
      { jenis: 'kartu', judul: 'Kode warna', teks: 'Warna ini dipakai di semua materi:\n[a:Biru] = suku pertama ([a:a])\n[r:Oranye] = rasio ([r:r])\n[n:Hijau] = urutan suku ([n:n])' },
    ],
    soal: ['P01', 'P02'],
    refleksi: 'Dengan kata-katamu sendiri, apa bedanya barisan dan deret?',
  },
  {
    id: 'M1', judul: 'Pola yang Dikali', ringkas: 'Menemukan rasio dari kehidupan sehari-hari', menit: 10,
    segmen: [
      { jenis: 'materi', judul: 'Melipat kertas', teks: 'Selembar kertas dilipat dua. Setiap dilipat, tebalnya menjadi **dua kali lipat**.', visual: { tipe: 'lipat', langkah: 3 } },
      { jenis: 'materi', judul: 'Bakteri membelah', teks: 'Satu bakteri membelah menjadi 2, lalu 4, lalu 8. Setiap langkah [r:×2].', visual: { tipe: 'titik', awal: 1, rasio: 2, langkah: 3, satuan: 'bakteri' } },
      { jenis: 'materi', judul: 'Barisan geometri', teks: 'Barisan yang setiap sukunya diperoleh dari suku sebelumnya **dikali bilangan tetap** disebut **barisan geometri**.', rumus: 'r' },
      { jenis: 'contoh', judul: 'Contoh 1', soal: 'Tentukan rasio barisan 5, 15, 45, 135.', langkah: [
        'Bagi suku ke-2 dengan suku ke-1: 15 : 5 = 3.',
        'Cek suku berikutnya: 45 : 15 = 3 ✔ dan 135 : 45 = 3 ✔',
        'Jadi rasionya [r:r = 3].',
      ] },
      { jenis: 'contoh', judul: 'Contoh 2 (giliranmu)', soal: 'Tentukan rasio barisan 7, 14, 28, 56.', langkah: [
        { teks: 'Bagi suku ke-2 dengan suku ke-1: 14 : 7 = …', kosong: { kunci: 2 } },
        'Cek: 28 : 14 = 2 ✔. Jadi [r:r = 2].',
      ] },
    ],
    soal: ['G02', 'G03'],
    refleksi: 'Mengapa pola lipatan kertas disebut "dikali", bukan "ditambah"?',
  },
  {
    id: 'M2', judul: 'Suku ke-n', ringkas: 'Rumus Uₙ = a · rⁿ⁻¹', menit: 15,
    segmen: [
      { jenis: 'materi', judul: 'Perhatikan pola ini', teks: 'Barisan 3, 6, 12, 24. Suku pertama [a:a = 3], rasio [r:r = 2].', visual: { tipe: 'titik', awal: 3, rasio: 2, langkah: 2, satuan: '' } },
      { jenis: 'materi', judul: 'Berapa kali dikali 2?', teks: 'Hitung banyaknya [r:× 2] pada setiap suku.', tabel: [
        ['U₁', '[a:3]', '3'],
        ['U₂', '[a:3] [r:× 2]', '6'],
        ['U₃', '[a:3] [r:× 2 × 2]', '12'],
        ['U₄', '[a:3] [r:× 2 × 2 × 2]', '24'],
      ] },
      { jenis: 'materi', judul: 'Polanya', teks: 'Suku ke-[n:4] dikali 2 sebanyak **3 kali**. Suku pertama belum dikali.\nJadi suku ke-[n:n] dikali [r:r] sebanyak **([n:n] − 1) kali**.' },
      { jenis: 'materi', judul: 'Rumus suku ke-n', teks: 'Rumus suku ke-n barisan geometri:', rumus: 'Un' },
      { jenis: 'contoh', judul: 'Contoh 1', soal: 'Tentukan suku ke-5 dari barisan 2, 6, 18, …', langkah: [
        '[a:a = 2], [r:r = 6 : 2 = 3], [n:n = 5]',
        'U₅ = 2 × 3⁽⁵⁻¹⁾ = 2 × 3⁴',
        '3⁴ = 3 × 3 × 3 × 3 = 81',
        'U₅ = 2 × 81 = **162**',
      ] },
      { jenis: 'contoh', judul: 'Contoh 2 (giliranmu)', soal: 'Tentukan suku ke-6 dari barisan 4, 8, 16, …', langkah: [
        '[a:a = 4], [r:r = 2], [n:n = 6]',
        'U₆ = 4 × 2⁽⁶⁻¹⁾ = 4 × 2⁵',
        { teks: '2⁵ = …', kosong: { kunci: 32 } },
        { teks: 'U₆ = 4 × 32 = …', kosong: { kunci: 128 } },
      ] },
    ],
    soal: ['G01', 'G11', 'G04'],
    refleksi: 'Mengapa pangkat pada rumus Uₙ adalah n − 1, bukan n?',
  },
  {
    id: 'M3', judul: 'Pola yang Mengecil', ringkas: 'Rasio antara 0 dan 1', menit: 10,
    segmen: [
      { jenis: 'materi', judul: 'Bola memantul', teks: 'Bola dijatuhkan dari 160 cm. Setiap memantul, tingginya tinggal **setengah**.', visual: { tipe: 'bola', tinggi: 160, rasio: 0.5, langkah: 4 } },
      { jenis: 'materi', judul: 'Rasio kurang dari 1', teks: 'Barisannya 160, 80, 40, 20, … Setiap langkah [r:× ½].\nJika 0 < [r:r] < 1, barisan **mengecil**.' },
      { jenis: 'materi', judul: 'Persen yang berkurang', teks: 'Turun 20% berarti yang tersisa 100% − 20% = **80%**.\nJadi setiap tahun harganya [r:× 0,8].' },
      { jenis: 'contoh', judul: 'Contoh 1', soal: 'Barisan 64, 32, 16, … Tentukan suku ke-6.', langkah: [
        '[a:a = 64], [r:r = 32 : 64 = ½], [n:n = 6]',
        'U₆ = 64 × (½)⁵ = 64 : 32',
        'U₆ = **2**',
      ] },
      { jenis: 'contoh', judul: 'Contoh 2 (giliranmu)', soal: 'Harga HP Rp2.000.000 turun 10% setiap tahun. Berapa harganya setelah 1 tahun?', langkah: [
        'Turun 10% berarti tersisa 90%, jadi [r:r = 0,9].',
        { teks: '2.000.000 × 0,9 = …', kosong: { kunci: 1800000, satuan: 'rupiah' } },
      ] },
    ],
    soal: ['G05', 'G06', 'G10'],
    refleksi: 'Berikan satu contoh lain di sekitarmu yang polanya mengecil dengan dikali tetap.',
  },
  {
    id: 'M4', judul: 'Deret: Menjumlahkan', ringkas: 'Rumus Sₙ untuk total', menit: 15,
    segmen: [
      { jenis: 'materi', judul: 'Pesan berantai', teks: 'Dina mengirim pesan ke 3 teman. Setiap penerima meneruskan ke 3 orang baru.', visual: { tipe: 'titik', awal: 3, rasio: 3, langkah: 2, satuan: 'orang' } },
      { jenis: 'materi', judul: 'Barisan atau deret?', teks: 'Banyak penerima tiap hari: 3, 9, 27, … → **barisan**.\n**Total** penerima: 3 + 9 + 27 + … → **deret**.' },
      { jenis: 'materi', judul: 'Rumus jumlah n suku', teks: 'Untuk [r:r] > 1:', rumus: 'Sn', catatan: 'Jika 0 < r < 1, pakai Sₙ = a(1 − rⁿ) : (1 − r).' },
      { jenis: 'contoh', judul: 'Contoh 1', soal: 'Hitung 2 + 4 + 8 + 16.', langkah: [
        '[a:a = 2], [r:r = 2], [n:n = 4]',
        'S₄ = 2 × (2⁴ − 1) : (2 − 1)',
        'S₄ = 2 × 15 : 1 = **30**',
        'Cek dengan menjumlah langsung: 2 + 4 + 8 + 16 = 30 ✔',
      ] },
      { jenis: 'contoh', judul: 'Contoh 2 (giliranmu)', soal: 'Hitung 5 + 10 + 20 + 40 + 80.', langkah: [
        '[a:a = 5], [r:r = 2], [n:n = 5]',
        { teks: '2⁵ − 1 = …', kosong: { kunci: 31 } },
        { teks: 'S₅ = 5 × 31 : 1 = …', kosong: { kunci: 155 } },
      ] },
    ],
    soal: ['G07', 'G08', 'G09'],
    refleksi: 'Bagaimana caramu tahu sebuah soal meminta Uₙ atau Sₙ?',
  },
  {
    id: 'M5', judul: 'Geometri atau Aritmetika?', ringkas: 'Dikali tetap atau ditambah tetap', menit: 10,
    segmen: [
      { jenis: 'materi', judul: 'Dua jenis barisan', teks: 'Bandingkan:', tabel: [
        ['Aritmetika', '**ditambah** bilangan tetap', '3, 7, 11, 15 (+4)'],
        ['Geometri', '**dikali** bilangan tetap', '3, 6, 12, 24 ([r:×2])'],
      ] },
      { jenis: 'materi', judul: 'Cara mengecek', teks: '1. Hitung **selisih**: U₂ − U₁, U₃ − U₂. Jika sama → aritmetika.\n2. Jika tidak, hitung **hasil bagi**: U₂ : U₁, U₃ : U₂. Jika sama → geometri.' },
      { jenis: 'contoh', judul: 'Contoh', soal: 'Barisan 2, 6, 18, 54. Aritmetika atau geometri?', langkah: [
        'Selisih: 6 − 2 = 4, 18 − 6 = 12. Tidak sama.',
        'Hasil bagi: 6 : 2 = 3, 18 : 6 = 3, 54 : 18 = 3. Sama!',
        'Jadi barisan **geometri** dengan [r:r = 3].',
      ] },
    ],
    soal: ['P03', 'P04', 'P05'],
    refleksi: 'Tuliskan satu contoh barisan aritmetika dan satu contoh barisan geometri buatanmu sendiri.',
  },
  {
    id: 'M6', judul: 'Tantangan Literasi', ringkas: 'Masalah nyata, keputusan nyata', menit: 20,
    segmen: [
      { jenis: 'materi', judul: 'Empat langkah literasi', teks: '1. **Pahami**: apa yang diketahui dan ditanya?\n2. **Modelkan**: dikali tetap? Berapa [a:a] dan [r:r]?\n3. **Hitung**: pakai Uₙ atau Sₙ.\n4. **Periksa**: apakah hasilnya masuk akal?' },
    ],
    soal: ['G12', 'G13'],
    refleksi: 'Jika kamu boleh memilih hadiah selama 30 hari, tawaran mana yang kamu pilih? Mengapa?',
  },
]

export const cariModul = (id) => MODUL.find((m) => m.id === id)
