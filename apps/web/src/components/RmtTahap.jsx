import { Link } from 'react-router-dom'
import { RMT_TAHAP } from '../content/rmt.js'

// Penunjuk tahap RMT yang sedang dijalani (ringkas agar tidak menambah beban kognitif)
export default function RmtTahap({ tahap }) {
  const t = RMT_TAHAP[tahap - 1]
  return (
    <div className="rmt-tahap" aria-label={`Tahap RMT ${tahap}: ${t.nama}`}>
      <ol>
        {RMT_TAHAP.map((x) => (
          <li key={x.no} className={x.no === tahap ? 'aktif' : x.no < tahap ? 'lewat' : ''} style={{ '--warna-rmt': x.warna }}>
            <span className="bulat">{x.no < tahap ? '✓' : x.no}</span>
            <span className="nama">{x.singkat}</span>
          </li>
        ))}
      </ol>
      <Link to="/rmt" className="rmt-info">Tahap {tahap}: {t.nama} ⓘ</Link>
    </div>
  )
}
