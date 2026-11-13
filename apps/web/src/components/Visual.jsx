// Visual ringan (CSS/SVG) agar cepat di HP. Label diletakkan langsung di gambar (spatial contiguity).
import { formatAngka, formatPendek, subskrip } from '../lib/geometri.js'

const MAKS_TITIK = 30

function Titik({ awal, rasio, langkah, satuan }) {
  const baris = Array.from({ length: langkah + 1 }, (_, i) => awal * rasio ** i)
  return (
    <div className="vis-titik" role="img" aria-label={`Barisan ${baris.join(', ')}`}>
      {baris.map((n, i) => (
        <div key={i} className="vis-baris" style={{ animationDelay: `${i * 0.6}s` }}>
          {i > 0 && <div className="vis-kali">× {rasio}</div>}
          <div className="vis-isi">
            <span className="vis-label">U{subskrip(i + 1)} = {formatAngka(n)} {satuan}</span>
            <span className="vis-dots">
              {Array.from({ length: Math.min(n, MAKS_TITIK) }, (_, k) => <i key={k} />)}
              {n > MAKS_TITIK && <b>…</b>}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Lipat({ langkah }) {
  return (
    <div className="vis-lipat" role="img" aria-label="Kertas dilipat, lapisannya 1, 2, 4, 8">
      {Array.from({ length: langkah + 1 }, (_, i) => (
        <div key={i} className="vis-lipat-kol" style={{ animationDelay: `${i * 0.6}s` }}>
          <div className="vis-tumpuk" style={{ width: `${88 / 2 ** (i / 2)}%` }}>
            {Array.from({ length: 2 ** i }, (_, k) => <i key={k} />)}
          </div>
          <span>{i}× lipat<br /><strong>{2 ** i} lapis</strong></span>
          {i < langkah && <em className="vis-kali">×2</em>}
        </div>
      ))}
    </div>
  )
}

function Bola({ tinggi, rasio, langkah }) {
  const W = 320, H = 190, tanah = 165, skala = 130 / tinggi
  let x = 30
  const jalur = [`M ${x} ${tanah - tinggi * skala} L ${x} ${tanah}`]
  const label = [{ x: x + 4, y: tanah - tinggi * skala - 6, t: `${formatAngka(tinggi)} cm`, mulai: true }]
  for (let k = 1; k <= langkah; k++) {
    const h = tinggi * rasio ** k
    const w = 70 * Math.sqrt(rasio ** k) + 22
    jalur.push(`Q ${x + w / 2} ${tanah - 2 * h * skala} ${x + w} ${tanah}`)
    label.push({ x: x + w / 2, y: tanah - h * skala - 6, t: `${formatAngka(h)}` })
    x += w
  }
  return (
    <svg className="vis-bola" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Tinggi pantulan bola makin kecil">
      <line x1="10" x2={W - 10} y1={tanah} y2={tanah} className="garis" />
      <path d={jalur.join(' ')} className="lintasan" />
      {label.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor={l.mulai ? 'start' : 'middle'} className={l.mulai ? 'lbl-a' : 'lbl'}>{l.t}</text>
      ))}
      <text x={W - 12} y={tanah + 18} textAnchor="end" className="lbl-r">setiap pantulan × {formatAngka(rasio)}</text>
    </svg>
  )
}

export function Batang({ nilai }) {
  const W = 320, H = 170, dasar = 140
  const maks = Math.max(...nilai.map(Math.abs), 1e-12)
  const lebar = (W - 20) / nilai.length
  return (
    <svg className="vis-batang" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Grafik batang ${nilai.map(formatAngka).join(', ')}`}>
      {nilai.map((v, i) => {
        const h = Math.max(2, (Math.abs(v) / maks) * 110)
        const x = 10 + i * lebar
        return (
          <g key={i}>
            <rect x={x + lebar * 0.15} y={dasar - h} width={lebar * 0.7} height={h} rx="3" className={i === 0 ? 'bar-a' : 'bar'} />
            <text x={x + lebar / 2} y={dasar - h - 5} textAnchor="middle" className="lbl t-kecil">{formatPendek(v)}</text>
            <text x={x + lebar / 2} y={dasar + 16} textAnchor="middle" className="lbl-n t-kecil">{i + 1}</text>
          </g>
        )
      })}
      <line x1="8" x2={W - 8} y1={dasar} y2={dasar} className="garis" />
    </svg>
  )
}

export default function Visual({ v }) {
  if (!v) return null
  if (v.tipe === 'titik') return <Titik {...v} />
  if (v.tipe === 'lipat') return <Lipat {...v} />
  if (v.tipe === 'bola') return <Bola {...v} />
  if (v.tipe === 'batang') return <Batang nilai={v.nilai} />
  return null
}
