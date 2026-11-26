// Kartu modul (Peta Petualangan) dengan bangun ruang / bangun datar 3D yang berputar.
import { Link } from 'react-router-dom'
import { MODUL } from '../content/modul.js'
import Bangun3D from './Bangun3D.jsx'

const BENTUK_3D = {
  M0: ['papan-persegi', '#fde047'],
  M1: ['prisma-segitiga', '#a5f3fc'],
  M2: ['prisma-segienam', '#fbcfe8'],
  M3: ['bola', '#fef08a'],
  M4: ['kubus', '#bbf7d0'],
  M5: ['tabung', '#fde68a'],
  M6: ['limas', '#fecaca'],
}

export default function GridModul({ progres }) {
  return (
    <ol className="grid-modul">
      {MODUL.map((m, i) => {
        const p = progres[m.id]
        const status = p?.selesai ? 'selesai' : p?.pos ? 'jalan' : 'baru'
        const [jenis, warna] = BENTUK_3D[m.id]
        return (
          <li key={m.id}>
            <Link to={`/modul/${m.id}`} className={`kartu-modul ${status}`} style={{ '--aksen': m.warna }}>
              <span className="km-3d"><Bangun3D jenis={jenis} warna={warna} ukuran={76} durasi={9 + (i % 3) * 2} jeda={-i * 1.3} /></span>
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
