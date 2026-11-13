import { Link } from 'react-router-dom'
import { useInstall } from '../lib/install.js'

export function Kepala({ judul, kembali = '/' }) {
  return (
    <header className="kepala">
      {kembali ? <Link to={kembali} className="tombol-kembali" aria-label="Kembali">←</Link> : <span className="logo" aria-hidden>▮</span>}
      <h1>{judul}</h1>
    </header>
  )
}

export function Halaman({ judul, kembali, children }) {
  return (
    <>
      <Kepala judul={judul} kembali={kembali} />
      <main className="isi">{children}</main>
    </>
  )
}

export function BannerPasang() {
  const { bisaPasang, standalone, ios, pasang } = useInstall()
  if (standalone) return null
  if (bisaPasang) {
    return (
      <div className="banner">
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
