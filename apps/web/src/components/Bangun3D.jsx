// Bangun ruang & bangun datar 3D sungguhan dengan CSS 3D (tanpa pustaka).
// Prisma n-sisi (kubus, balok, prisma, tabung, "papan" bangun datar tebal), limas n-sisi (limas, kerucut), bola.
const rad = (d) => (d * Math.PI) / 180
const gelap = (warna, p) => `color-mix(in srgb, ${warna} ${p}%, #1e1b4b)`
const terang = (warna, p) => `color-mix(in srgb, ${warna} ${p}%, #ffffff)`

function tutup(n, atas) {
  // titik sudut segi-n (sejajar dengan sisi tegak) untuk clip-path tutup atas/bawah
  return 'polygon(' + Array.from({ length: n }, (_, j) => {
    const f = rad(j * (360 / n) + 180 / n)
    const x = 50 + 50 * Math.sin(f)
    const y = atas ? 50 + 50 * Math.cos(f) : 50 - 50 * Math.cos(f)
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`
  }).join(',') + ')'
}

function Prisma({ n, r, t, warna }) {
  const a = r * Math.cos(Math.PI / n), fw = 2 * r * Math.sin(Math.PI / n)
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const th = (i * 360) / n
        return (
          <span key={i} className="m3d" style={{
            width: fw + 0.8, height: t, left: r - fw / 2 - 0.4, top: 0,
            transform: `rotateY(${th}deg) translateZ(${a}px)`, background: gelap(warna, 70 + 30 * Math.cos(rad(th - 35))),
          }} />
        )
      })}
      <span className="m3d" style={{ width: 2 * r, height: 2 * r, left: 0, top: t / 2 - r, clipPath: tutup(n, true), transform: `rotateX(90deg) translateZ(${t / 2}px)`, background: terang(warna, 75) }} />
      <span className="m3d" style={{ width: 2 * r, height: 2 * r, left: 0, top: t / 2 - r, clipPath: tutup(n, false), transform: `rotateX(-90deg) translateZ(${t / 2}px)`, background: gelap(warna, 55) }} />
    </>
  )
}

function Limas({ n, r, t, warna }) {
  const a = r * Math.cos(Math.PI / n), fw = 2 * r * Math.sin(Math.PI / n)
  const l = Math.hypot(t, a), alfa = (Math.atan(a / t) * 180) / Math.PI
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const th = (i * 360) / n
        return (
          <span key={i} className="m3d" style={{
            width: fw + 0.8, height: l, left: r - fw / 2 - 0.4, top: t - l, transformOrigin: '50% 100%',
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            transform: `rotateY(${th}deg) translateZ(${a}px) rotateX(${alfa}deg)`, background: gelap(warna, 68 + 32 * Math.cos(rad(th - 35))),
          }} />
        )
      })}
      <span className="m3d" style={{ width: 2 * r, height: 2 * r, left: 0, top: t / 2 - r, clipPath: tutup(n, false), transform: `rotateX(-90deg) translateZ(${t / 2}px)`, background: gelap(warna, 55) }} />
    </>
  )
}

function Bola({ r, warna }) {
  const cincin = { position: 'absolute', borderRadius: '50%', border: `2px solid ${terang(warna, 70)}` }
  return (
    <>
      {[0, 30, 60, 90, 120, 150].map((d) => (
        <span key={`m${d}`} className="m3d" style={{ ...cincin, width: 2 * r, height: 2 * r, left: 0, top: 0, transform: `rotateY(${d}deg)` }} />
      ))}
      {[-55, -28, 0, 28, 55].map((p) => {
        const d = 2 * r * Math.cos(rad(p))
        return <span key={`l${p}`} className="m3d" style={{ ...cincin, width: d, height: d, left: r - d / 2, top: r - d / 2, transform: `rotateX(90deg) translateZ(${r * Math.sin(rad(p))}px)` }} />
      })}
    </>
  )
}

// jenis -> [bentuk, n, r (×ukuran), t (×ukuran), gaya putar]
const RESEP = {
  kubus: ['prisma', 4, 0.62 / Math.SQRT2, 0.62, 'putar'],
  balok: ['prisma', 4, 0.36, 0.7, 'putar'],
  'prisma-segitiga': ['prisma', 3, 0.4, 0.6, 'putar'],
  'prisma-segienam': ['prisma', 6, 0.38, 0.42, 'putar'],
  tabung: ['prisma', 20, 0.32, 0.62, 'putar'],
  kerucut: ['limas', 20, 0.34, 0.66, 'putar'],
  limas: ['limas', 4, 0.44, 0.58, 'putar'],
  'limas-segitiga': ['limas', 3, 0.44, 0.6, 'putar'],
  bola: ['bola', 0, 0.38, 0, 'putar'],
  'papan-persegi': ['prisma', 4, 0.42, 0.09, 'koin'],
  'papan-segitiga': ['prisma', 3, 0.46, 0.09, 'koin'],
  'papan-segienam': ['prisma', 6, 0.42, 0.09, 'koin'],
  'papan-lingkaran': ['prisma', 24, 0.4, 0.09, 'koin'],
}

export const JENIS_3D = Object.keys(RESEP)

export default function Bangun3D({ jenis = 'kubus', ukuran = 80, warna = '#6366f1', durasi = 10, jeda = 0 }) {
  const [bentuk, n, rf, tf, gaya] = RESEP[jenis] || RESEP.kubus
  const r = rf * ukuran, t = bentuk === 'bola' ? 2 * r : tf * ukuran
  const isi = bentuk === 'prisma' ? <Prisma n={n} r={r} t={t} warna={warna} />
    : bentuk === 'limas' ? <Limas n={n} r={r} t={t} warna={warna} />
      : <Bola r={r} warna={warna} />
  return (
    <span className="b3d" style={{ width: ukuran, height: ukuran, perspective: `${ukuran * 5}px` }} aria-hidden>
      {bentuk === 'bola' && <span className="b3d-cahaya" style={{ width: 2 * r, height: 2 * r, background: `radial-gradient(circle at 35% 30%, #fff, ${warna} 55%, ${gelap(warna, 60)})` }} />}
      <span className={`b3d-obj ${gaya}`} style={{ width: 2 * r, height: t, animationDuration: `${durasi}s`, animationDelay: `${jeda}s` }}>
        {isi}
      </span>
    </span>
  )
}
