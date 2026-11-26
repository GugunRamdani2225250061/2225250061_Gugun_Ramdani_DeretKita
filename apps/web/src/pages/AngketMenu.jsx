import { Link } from 'react-router-dom'
import { Halaman } from '../components/Layout.jsx'
import { useStore } from '../lib/store.js'

export default function AngketMenu() {
  const { profil, angket } = useStore()
  const sudah = (j) => angket.some((a) => a.kode_siswa === profil.kode && a.jenis === j)
  return (
    <Halaman judul="📝 Angket" warna="#db2777">
      <p className="kecil">Isi setelah selesai belajar. Tidak ada jawaban benar atau salah.</p>
      <div className="grid-pintas">
        <Link to="/angket/leppink" className="pintas" style={{ '--aksen': '#7c3aed' }}>
          <span className="pintas-ikon">🧠</span><strong>Angket Belajar</strong>
          <small>{sudah('leppink') ? 'Sudah diisi ✔' : '10 pernyataan tentang pengalaman belajarmu'}</small>
        </Link>
        <Link to="/angket/sus" className="pintas" style={{ '--aksen': '#db2777' }}>
          <span className="pintas-ikon">📱</span><strong>Angket Aplikasi</strong>
          <small>{sudah('sus') ? 'Sudah diisi ✔' : '10 pernyataan tentang aplikasi ini'}</small>
        </Link>
      </div>
    </Halaman>
  )
}
