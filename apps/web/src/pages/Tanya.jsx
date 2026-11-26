import { Halaman } from '../components/Layout.jsx'
import KakDeret from '../components/KakDeret.jsx'

const SARAN = [
  { label: 'Apa bedanya barisan dan deret?' },
  { label: 'Kenapa pangkatnya n − 1?' },
  { label: 'Contoh barisan geometri di sekitarku?' },
  { label: 'Bagaimana cara mencari rasio?' },
]

export default function Tanya() {
  return (
    <Halaman judul="🤖 Tanya Kak Deret" warna="#4f46e5">
      <section className="kartu">
        <p>Tanyakan apa saja tentang <strong>barisan dan deret geometri</strong>. Kak Deret akan membantumu <strong>berpikir sendiri</strong> dengan pertanyaan pemandu, bukan langsung memberi jawaban.</p>
      </section>
      <KakDeret mode="tanya" selaluBuka aksiCepat={SARAN} konteks={{}} />
    </Halaman>
  )
}
