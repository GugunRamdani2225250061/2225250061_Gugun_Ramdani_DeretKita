// Karakter "Kak Deret": robot ramah dengan layar wajah. Animasi halus (kedip, antena menyala).
// keadaan: 'diam' | 'berpikir' | 'senang'
import { useId } from 'react'

export default function AvatarKakDeret({ ukuran = 48, keadaan = 'diam', melambai = false }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`avatar-kd kd-${keadaan} ${melambai ? 'kd-lambai' : ''}`} viewBox="0 0 100 100" width={ukuran} height={ukuran} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`kp${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#818cf8" /><stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={`lw${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1b4b" /><stop offset="1" stopColor="#312e81" />
        </linearGradient>
        <radialGradient id={`an${id}`}>
          <stop offset="0" stopColor="#fff7ed" /><stop offset=".5" stopColor="#fb923c" /><stop offset="1" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      {/* antena (warna oranye = simbol rasio r) */}
      <line x1="50" y1="8" x2="50" y2="22" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" />
      <circle className="kd-antena" cx="50" cy="8" r="6.5" fill={`url(#an${id})`} />
      {/* telinga */}
      <rect x="6" y="42" width="10" height="22" rx="5" fill="#a78bfa" />
      <rect x="84" y="42" width="10" height="22" rx="5" fill="#a78bfa" />
      {/* kepala */}
      <rect x="13" y="20" width="74" height="66" rx="22" fill={`url(#kp${id})`} />
      <rect x="13" y="20" width="74" height="30" rx="22" fill="#fff" opacity=".12" />
      {/* layar wajah */}
      <rect x="22" y="32" width="56" height="40" rx="14" fill={`url(#lw${id})`} />
      <g className="kd-mata">
        <ellipse cx="38" cy="50" rx="6" ry="7" fill="#67e8f9" />
        <ellipse cx="62" cy="50" rx="6" ry="7" fill="#67e8f9" />
        <circle cx="40" cy="47" r="2" fill="#fff" />
        <circle cx="64" cy="47" r="2" fill="#fff" />
      </g>
      <path className="kd-mulut" d="M41 61 Q50 68 59 61" stroke="#67e8f9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* pipi */}
      <circle cx="28" cy="62" r="3.5" fill="#f472b6" opacity=".8" />
      <circle cx="72" cy="62" r="3.5" fill="#f472b6" opacity=".8" />
      {/* lencana r di dada */}
      <circle cx="50" cy="92" r="7" fill="#fff" />
      <text x="50" y="95.5" textAnchor="middle" fontSize="10" fontWeight="800" fill="#c2410c" fontFamily="Georgia, serif">r</text>
      {melambai && <path className="kd-tangan" d="M88 70 q10 -6 8 -18" stroke="#a78bfa" strokeWidth="7" fill="none" strokeLinecap="round" />}
    </svg>
  )
}
