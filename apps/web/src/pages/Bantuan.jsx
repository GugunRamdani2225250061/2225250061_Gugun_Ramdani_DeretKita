import { Halaman } from '../components/Layout.jsx'

const TANYA = [
  ['Bagaimana cara mulai belajar?', 'Buka menu Modul atau tekan tombol "Mulai" di Lobi. Ikuti dari Modul 0 secara berurutan.'],
  ['Apa arti 3 tahap di atas layar modul?', 'Itu tahap model RMT: (1) Amati & kenali, (2) Bangun konsep, (3) Terapkan & hubungkan. Lihat menu Model RMT.'],
  ['Saya bingung saat mengerjakan soal.', 'Tekan "Petunjuk" untuk bantuan bertahap, atau "Tanya Kak Deret" untuk dibimbing berpikir. Setelah 2 kali salah, kamu boleh melihat pembahasan.'],
  ['Bagaimana cara menulis jawaban?', 'Tulis angkanya saja. Contoh: 12800000 atau 12.800.000, pecahan 1/2, desimal 0,8.'],
  ['Apa itu skala 1–9 setelah soal?', 'Pilih seberapa besar usaha pikiranmu: 1 sangat ringan, 9 sangat berat. Jawab dengan jujur, tidak ada jawaban salah.'],
  ['Bagaimana memasang aplikasi di HP?', 'Android: buka di Chrome → tombol Pasang (atau menu ⋮ → Instal aplikasi). iPhone: Safari → Bagikan → Tambahkan ke Layar Utama.'],
  ['Apakah bisa dipakai tanpa internet?', 'Bisa, setelah aplikasi dibuka sekali. Hanya Kak Deret yang butuh internet.'],
  ['Huruf terlalu kecil / sulit dibaca?', 'Buka Pengaturan → pilih jenis dan ukuran huruf yang nyaman.'],
  ['Apakah data saya aman?', 'Aplikasi hanya menyimpan nama panggilan dan kode acak. Tidak ada nama lengkap, foto, atau nomor HP.'],
]

export default function Bantuan() {
  return (
    <Halaman judul="❓ Bantuan" warna="#0d9488">
      {TANYA.map(([t, j]) => (
        <details key={t} className="kartu tanya-jawab">
          <summary>{t}</summary>
          <p>{j}</p>
        </details>
      ))}
    </Halaman>
  )
}
