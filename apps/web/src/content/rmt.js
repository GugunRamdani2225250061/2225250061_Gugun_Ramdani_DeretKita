// Model pembelajaran Rigorous Mathematical Thinking (RMT), Kinard & Kozulin (2008).
// Setiap langkah di modul dipetakan ke salah satu dari 3 tahap RMT.
export const RMT_TAHAP = [
  {
    no: 1, nama: 'Pengembangan Kognitif', singkat: 'Amati & kenali', warna: '#7c3aed',
    fungsi: 'Kualitatif: memberi nama, mengamati, membandingkan, mencari informasi secara sistematis',
    alat: 'Kartu istilah, gambar bergerak, tabel',
    aktivitas: 'Mengenal istilah (suku, rasio, deret) dan mengamati pola dikali pada bakteri, kertas, dan bola.',
  },
  {
    no: 2, nama: 'Konten sebagai Proses', singkat: 'Bangun konsep', warna: '#0891b2',
    fungsi: 'Kuantitatif & tepat: menganalisis pola, menjaga keajegan rasio, menghitung teliti dengan simbol a, r, n',
    alat: 'Tabel pola, rumus Uₙ dan Sₙ, contoh soal terurai',
    aktivitas: 'Menemukan sendiri rumus dari pola, lalu mengisi langkah contoh soal yang dikosongkan.',
  },
  {
    no: 3, nama: 'Praktik Konstruksi Kognitif Konseptual', singkat: 'Terapkan & hubungkan', warna: '#db2777',
    fungsi: 'Relasional-abstrak: menemukan hubungan, menggeneralisasi, berpikir hipotetis, memeriksa kewajaran hasil',
    alat: 'Soal literasi 4 langkah, refleksi, Kak Deret (mediator AI)',
    aktivitas: 'Menyelesaikan masalah sehari-hari (Pahami → Modelkan → Hitung → Periksa) dan menulis refleksi.',
  },
]

/** Tahap RMT untuk satu langkah modul: segmen boleh menentukan sendiri lewat `rmt`. */
export function tahapLangkah(l) {
  if (l.tipe === 'segmen') return l.s.rmt ?? (l.s.jenis === 'contoh' ? 2 : 1)
  return 3 // soal, refleksi, selesai
}
