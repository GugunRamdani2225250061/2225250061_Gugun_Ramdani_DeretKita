// Bangun datar & bangun ruang (SVG ringan) untuk menu dan lobi.
// Hanya hiasan di halaman menu (bukan di layar belajar), sesuai prinsip coherence.
import { useId } from 'react'

const TERANG = 'rgba(255,255,255,.45)'
const GELAP = 'rgba(0,0,0,.22)'

export const DAFTAR_BENTUK = ['persegi', 'segitiga', 'lingkaran', 'segienam', 'kubus', 'tabung', 'kerucut', 'limas', 'bola', 'belahketupat']

export default function Bentuk({ jenis, warna = '#6366f1', ukuran = 48, className = '' }) {
  const id = useId().replace(/:/g, '')
  const g = `url(#g${id})`
  const isi = {
    persegi: <rect x="18" y="18" width="64" height="64" rx="8" fill={g} />,
    segitiga: <polygon points="50,12 90,86 10,86" fill={g} strokeLinejoin="round" />,
    lingkaran: <circle cx="50" cy="50" r="38" fill={g} />,
    segienam: <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill={g} />,
    belahketupat: <polygon points="50,8 88,50 50,92 12,50" fill={g} />,
    kubus: (
      <>
        <polygon points="50,12 86,30 50,48 14,30" fill={g} />
        <polygon points="50,12 86,30 50,48 14,30" fill={TERANG} />
        <polygon points="14,30 50,48 50,90 14,72" fill={g} />
        <polygon points="86,30 50,48 50,90 86,72" fill={g} />
        <polygon points="86,30 50,48 50,90 86,72" fill={GELAP} />
      </>
    ),
    tabung: (
      <>
        <path d="M18 24 V76 A32 12 0 0 0 82 76 V24 Z" fill={g} />
        <path d="M50 24 V88 A32 12 0 0 0 82 76 V24 Z" fill={GELAP} />
        <ellipse cx="50" cy="24" rx="32" ry="12" fill={g} />
        <ellipse cx="50" cy="24" rx="32" ry="12" fill={TERANG} />
      </>
    ),
    kerucut: (
      <>
        <path d="M50 10 L84 76 A34 12 0 0 1 16 76 Z" fill={g} />
        <path d="M50 10 L84 76 A34 12 0 0 1 50 88 Z" fill={GELAP} />
        <ellipse cx="50" cy="76" rx="34" ry="12" fill="none" stroke={TERANG} strokeWidth="2" strokeDasharray="4 4" />
      </>
    ),
    limas: (
      <>
        <polygon points="50,10 14,74 50,90" fill={g} />
        <polygon points="50,10 86,74 50,90" fill={g} />
        <polygon points="50,10 86,74 50,90" fill={GELAP} />
        <polyline points="14,74 50,60 86,74" fill="none" stroke={TERANG} strokeWidth="2" strokeDasharray="4 4" />
      </>
    ),
    bola: (
      <>
        <circle cx="50" cy="50" r="38" fill={`url(#r${id})`} />
        <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke={TERANG} strokeWidth="2" strokeDasharray="4 4" />
      </>
    ),
  }[jenis]

  return (
    <svg className={`bentuk ${className}`} viewBox="0 0 100 100" width={ukuran} height={ukuran} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={warna} stopOpacity=".75" />
          <stop offset="1" stopColor={warna} />
        </linearGradient>
        <radialGradient id={`r${id}`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".35" stopColor={warna} stopOpacity=".85" />
          <stop offset="1" stopColor={warna} />
        </radialGradient>
      </defs>
      {isi}
    </svg>
  )
}
