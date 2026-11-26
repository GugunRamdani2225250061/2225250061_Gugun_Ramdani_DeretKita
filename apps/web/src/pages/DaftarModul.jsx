import { Halaman } from '../components/Layout.jsx'
import GridModul from '../components/GridModul.jsx'
import { useStore } from '../lib/store.js'

export default function DaftarModul() {
  const { profil, progres } = useStore()
  return (
    <Halaman judul="📚 Semua Modul" warna="#7c3aed" lebar>
      <p className="kecil">Ikuti urutannya dari Modul 0. Setiap modul memakai 3 tahap RMT: amati → bangun konsep → terapkan.</p>
      <GridModul progres={progres[profil.kode] || {}} />
    </Halaman>
  )
}
