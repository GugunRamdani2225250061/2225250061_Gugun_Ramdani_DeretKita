import { Halaman } from '../components/Layout.jsx'
import { RMT_TAHAP } from '../content/rmt.js'

export default function Rmt() {
  return (
    <Halaman judul="🧠 Model Belajar RMT" warna="#4f46e5">
      <section className="kartu">
        <p className="chip chip-materi">Rigorous Mathematical Thinking</p>
        <h2>Belajar berpikir matematis yang teliti</h2>
        <p>Di DeretKita kamu belajar melalui <strong>3 tahap</strong>. Setiap layar modul menunjukkan tahap yang sedang kamu jalani.</p>
      </section>

      {RMT_TAHAP.map((t) => (
        <section key={t.no} className="kartu kartu-rmt" style={{ '--warna-rmt': t.warna }}>
          <div className="rmt-no">{t.no}</div>
          <div>
            <h3>{t.nama}</h3>
            <p>{t.aktivitas}</p>
            <p className="kecil"><strong>Cara berpikir yang dilatih:</strong> {t.fungsi}</p>
            <p className="kecil"><strong>Alat bantu:</strong> {t.alat}</p>
          </div>
        </section>
      ))}

      <section className="kartu">
        <h3>🤖 Kak Deret sebagai mediator</h3>
        <p>Dalam RMT, guru (mediator) tidak langsung memberi jawaban. Mediator <strong>memfokuskan perhatianmu</strong>, menjelaskan <strong>makna</strong> setiap langkah, dan mengaitkannya dengan <strong>kehidupan sehari-hari</strong>. Kak Deret bekerja dengan cara yang sama.</p>
      </section>
      <p className="kecil">Sumber: Kinard, J. T., &amp; Kozulin, A. (2008). <em>Rigorous Mathematical Thinking: Conceptual Formation in the Mathematics Classroom</em>. Cambridge University Press.</p>
    </Halaman>
  )
}
