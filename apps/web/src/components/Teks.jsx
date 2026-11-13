// Menampilkan teks dengan markup sederhana:
// [a:..] biru (suku pertama), [r:..] oranye (rasio), [n:..] hijau (urutan suku), **tebal**, \n = baris baru.
const POLA = /(\[[arn]:[^\]]+\]|\*\*[^*]+\*\*)/g

export function Inline({ teks }) {
  return String(teks).split(POLA).map((bagian, i) => {
    let m = bagian.match(/^\[([arn]):([^\]]+)\]$/)
    if (m) return <span key={i} className={`sim sim-${m[1]}`}>{m[2]}</span>
    m = bagian.match(/^\*\*([^*]+)\*\*$/)
    if (m) return <strong key={i}>{m[1]}</strong>
    return bagian
  })
}

export default function Teks({ children, className = '' }) {
  return (
    <div className={`teks ${className}`}>
      {String(children).split('\n').map((baris, i) => <p key={i}><Inline teks={baris} /></p>)}
    </div>
  )
}
