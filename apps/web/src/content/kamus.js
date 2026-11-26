// Kamus istilah (pre-training yang bisa dibuka kapan saja)
export const KAMUS = [
  { istilah: 'Barisan', arti: 'Bilangan yang disusun berurutan mengikuti aturan tertentu.', contoh: '2, 4, 8, 16, …', bentuk: 'segitiga' },
  { istilah: 'Suku', arti: 'Setiap bilangan dalam barisan. Suku ke-n ditulis Uₙ.', contoh: 'Pada 2, 4, 8: U₂ = 4', bentuk: 'persegi' },
  { istilah: 'Suku pertama (a)', arti: 'Bilangan paling awal dalam barisan.', contoh: 'Pada 5, 10, 20: a = 5', bentuk: 'lingkaran' },
  { istilah: 'Rasio (r)', arti: 'Pengali tetap dari satu suku ke suku berikutnya. r = U₂ : U₁.', contoh: '3, 6, 12 → r = 2', bentuk: 'segienam' },
  { istilah: 'Barisan geometri', arti: 'Barisan yang setiap sukunya diperoleh dengan mengalikan suku sebelumnya dengan bilangan tetap.', contoh: '1, 3, 9, 27 (×3)', bentuk: 'kubus' },
  { istilah: 'Barisan aritmetika', arti: 'Barisan yang setiap sukunya diperoleh dengan menambah bilangan tetap (beda).', contoh: '3, 7, 11, 15 (+4)', bentuk: 'belahketupat' },
  { istilah: 'Beda (b)', arti: 'Penambah tetap pada barisan aritmetika. b = U₂ − U₁.', contoh: '3, 7, 11 → b = 4', bentuk: 'persegi' },
  { istilah: 'Deret', arti: 'Hasil penjumlahan suku-suku barisan. Jumlah n suku ditulis Sₙ.', contoh: '2 + 4 + 8 = 14', bentuk: 'tabung' },
  { istilah: 'Pangkat', arti: 'Perkalian berulang bilangan yang sama.', contoh: '2⁴ = 2 × 2 × 2 × 2 = 16', bentuk: 'limas' },
  { istilah: 'Suku ke-n (Uₙ)', arti: 'Rumus untuk mencari suku urutan ke-n tanpa menulis semua suku.', contoh: 'Uₙ = a · rⁿ⁻¹', bentuk: 'kerucut' },
  { istilah: 'Jumlah n suku (Sₙ)', arti: 'Rumus untuk menjumlahkan n suku pertama barisan geometri.', contoh: 'Sₙ = a(rⁿ − 1) : (r − 1)', bentuk: 'tabung' },
  { istilah: 'Pertumbuhan', arti: 'Pola yang membesar karena dikali bilangan lebih dari 1 (r > 1).', contoh: 'Bakteri membelah: ×2', bentuk: 'bola' },
  { istilah: 'Peluruhan', arti: 'Pola yang mengecil karena dikali bilangan antara 0 dan 1 (0 < r < 1).', contoh: 'Obat tinggal setengah: ×½', bentuk: 'bola' },
  { istilah: 'Persen', arti: 'Per seratus. Turun 20% berarti tersisa 80% = 0,8.', contoh: '20% dari 50.000 = 10.000', bentuk: 'lingkaran' },
  { istilah: 'Pola bilangan', arti: 'Susunan bilangan yang memiliki keteraturan.', contoh: '1, 4, 9, 16 (bilangan kuadrat)', bentuk: 'segitiga' },
]
