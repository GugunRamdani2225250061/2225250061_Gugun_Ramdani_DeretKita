import { Link } from 'react-router-dom'
import { useInstall } from '../lib/install.js'

export function Kepala({ judul, kembali = '/', warna }) {
  return (
    <header className="kepala" style={warna ? { '--kepala': warna } : undefined}>
      {kembali ? <Link to={kembali} className="tombol-kembali" aria-label="Kembali">←</Link> : <span className="logo" aria-hidden>▮</span>}
      <h1>{judul}</h1>
    </header>
  )
}

export function Halaman({ judul, kembali, warna, lebar = false, children }) {
  return (
    <>
      <Kepala judul={judul} kembali={kembali} warna={warna} />
      <main className={`isi ${lebar ? 'isi-lebar' : ''}`} style={warna ? { '--aksen': warna } : undefined}>{children}</main>
    </>
  )
}

export function BannerPasang() {
  const { bisaPasang, standalone, ios, pasang } = useInstall()
  if (standalone) return null
  if (bisaPasang) {
    return (
      <div className="banner">
        <span className="banner-ikon" aria-hidden>📲</span>
        <div><strong>Pasang DeretKita di HP-mu</strong><br />Bisa dibuka tanpa internet, tanpa Play Store.</div>
        <button className="btn kecil" onClick={pasang}>Pasang</button>
      </div>
    )
  }
  if (ios) {
    return <div className="banner"><div><strong>Pasang di iPhone:</strong> ketuk tombol <b>Bagikan</b> lalu pilih <b>Tambahkan ke Layar Utama</b>.</div></div>
  }
  return null
}
