import { useState } from 'react'

const PERSEPSI = ['Terlalu mudah', 'Sesuai', 'Sulit', 'Terlalu sulit']

// Skala beban mental Paas (1-9) + persepsi kesulitan (khusus mode uji coba)
export default function RatingBeban({ modeUjiCoba, onKirim }) {
  const [paas, setPaas] = useState(null)
  const [persepsi, setPersepsi] = useState(null)
  const siap = paas && (!modeUjiCoba || persepsi)
  return (
    <section className="kartu rating">
      <h2>Seberapa besar usaha pikiranmu untuk soal tadi?</h2>
      <div className="skala-paas" role="radiogroup" aria-label="Usaha mental 1 sampai 9">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((v) => (
          <button key={v} role="radio" aria-checked={paas === v} className={paas === v ? 'pilih' : ''} onClick={() => setPaas(v)}>{v}</button>
        ))}
      </div>
      <div className="skala-ket"><span>Sangat ringan</span><span>Sedang</span><span>Sangat berat</span></div>

      {modeUjiCoba && (
        <>
          <h3>Menurutmu, soal tadi …</h3>
          <div className="pilihan-persepsi" role="radiogroup" aria-label="Tingkat kesulitan">
            {PERSEPSI.map((p, i) => (
              <button key={p} role="radio" aria-checked={persepsi === i + 1} className={persepsi === i + 1 ? 'pilih' : ''} onClick={() => setPersepsi(i + 1)}>{p}</button>
            ))}
          </div>
        </>
      )}
      <button className="btn" disabled={!siap} onClick={() => onKirim({ paas, persepsi: persepsi ?? '' })}>Lanjut</button>
    </section>
  )
}
