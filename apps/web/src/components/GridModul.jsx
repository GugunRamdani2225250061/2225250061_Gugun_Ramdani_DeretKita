// Kartu modul berwarna dengan bangun datar/ruang sebagai lambang.
import { Link } from 'react-router-dom'
import { MODUL } from '../content/modul.js'
import Bentuk from './Bentuk.jsx'

const BENTUK_MODUL = { M0: 'persegi', M1: 'segitiga', M2: 'segienam', M3: 'bola', M4: 'kubus', M5: 'tabung', M6: 'limas' }

export default function GridModul({ progres }) {
  return (
    <ol className="grid-modul">
      {MODUL.map((m, i) => {
        const p = progres[m.id]
        const status = p?.selesai ? 'selesai' : p?.pos ? 'jalan' : 'baru'
        return (
          <li key={m.id}>
            <Link to={`/modul/${m.id}`} className={`kartu-modul ${status}`} style={{ '--aksen': m.warna }}>
              <span className="km-bentuk"><Bentuk jenis={BENTUK_MODUL[m.id]} warna="#ffffff" ukuran={58} /></span>
              <span className="km-no">Modul {i}</span>
              <strong className="km-judul">{m.ikon} {m.judul}</strong>
              <small className="km-ringkas">{m.ringkas}</small>
              <span className="km-status">
                {status === 'selesai'
                  ? <span className="bintang">{'★'.repeat(p.bintang)}{'☆'.repeat(3 - p.bintang)}</span>
                  : status === 'jalan' ? '▶ Lanjutkan' : `⏱ ${m.menit} menit`}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
