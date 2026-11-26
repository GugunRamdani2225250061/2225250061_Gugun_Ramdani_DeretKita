# Model Pembelajaran Rigorous Mathematical Thinking (RMT) di DeretKita

## Landasan
*Rigorous Mathematical Thinking* (Kinard & Kozulin, 2008) memadukan **teori sosiokultural Vygotsky** (alat psikologis, mediasi) dan **teori pengalaman belajar termediasi Feuerstein** (*Mediated Learning Experience*). Tujuannya membangun **fungsi kognitif** dan konsep matematika secara teliti dan bermakna, bukan sekadar menghafal prosedur.

Tiga tingkat fungsi kognitif yang dikembangkan:
1. **Kualitatif umum**: memberi label, memvisualisasi, membandingkan, mencari informasi secara sistematis.
2. **Kuantitatif dengan ketepatan**: menjaga keajegan (konservasi), mengukur/menghitung teliti, menganalisis, mengintegrasikan.
3. **Relasional-abstrak**: menemukan dan membandingkan hubungan, menggeneralisasi, berpikir hipotetis, berpikir inferensial, membuktikan secara logis.

## Tiga Tahap RMT dan Penerapannya di Aplikasi
| Tahap | Fungsi kognitif utama | Alat psikologis | Di DeretKita |
|---|---|---|---|
| **1. Pengembangan Kognitif** | Kualitatif: memberi nama, mengamati, membandingkan | Kartu istilah, gambar bergerak, tabel | Kartu pre-training (M0), visual bakteri/kertas/bola/pesan |
| **2. Konten sebagai Proses** | Kuantitatif & tepat: menganalisis pola, keajegan rasio, simbol a, r, n | Tabel pola, rumus, contoh terurai | Penurunan rumus Uₙ dan Sₙ dari tabel, contoh soal dengan *fading* (siswa mengisi langkah) |
| **3. Praktik Konstruksi Kognitif Konseptual** | Relasional-abstrak: hubungan, generalisasi, kewajaran hasil | Soal literasi 4 langkah, refleksi | Soal Pahami → Modelkan → Hitung → Periksa, refleksi akhir modul |

Setiap layar modul menampilkan **penunjuk tahap RMT** (Amati & kenali → Bangun konsep → Terapkan & hubungkan). Pemetaan diatur di `apps/web/src/content/rmt.js` (default: kartu/materi = tahap 1, contoh = tahap 2, soal & refleksi = tahap 3; layar materi yang membangun rumus diberi `rmt: 2` di `modul.js`).

## Mediator: Guru dan Kak Deret (AI)
Kriteria mediasi Feuerstein yang diterapkan pada prompt Kak Deret (`services/api/ai.py`):
| Kriteria | Wujud di Kak Deret |
|---|---|
| Intensionalitas & resiprositas | Memfokuskan siswa pada satu hal penting, lalu meminta siswa merespons (1–2 pertanyaan pemandu) |
| Makna | Menjelaskan mengapa sebuah langkah penting |
| Transendensi | Mengaitkan konsep dengan situasi sehari-hari lain (terutama di mode refleksi) |

Kak Deret **tidak memberi jawaban akhir**, menjawab maksimal ±60 kata (menjaga beban kognitif), dan menyesuaikan arah pertanyaannya dengan tahap RMT siswa.

## Keterkaitan dengan Beban Kognitif & Literasi
- **RMT + CLT**: tahap 1 berfungsi sebagai *pre-training* (menurunkan beban intrinsik), tahap 2 memakai *worked example + fading* (menurunkan beban ekstrinsik, menaikkan germane), tahap 3 melatih skema dalam konteks baru.
- **RMT + Literasi (PISA)**: tahap 3 memakai proses *merumuskan, menggunakan, menafsirkan/mengevaluasi*.

## Usulan Instrumen Tambahan (untuk penelitian)
- **Lembar observasi keterlaksanaan RMT** (guru/peneliti mencentang aktivitas tiap tahap).
- **Analisis transkrip Kak Deret**: kategorikan pertanyaan siswa per fungsi kognitif (kualitatif/kuantitatif/relasional).
- Kolom `ai_dipakai` di data jawaban untuk melihat hubungan bantuan AI dengan skor dan rating beban (Paas).

## Rujukan
- Kinard, J. T., & Kozulin, A. (2008). *Rigorous Mathematical Thinking: Conceptual Formation in the Mathematics Classroom*. Cambridge University Press.
- Feuerstein, R., Rand, Y., & Hoffman, M. (1979). *The Dynamic Assessment of Retarded Performers*. University Park Press.
- Vygotsky, L. S. (1978). *Mind in Society*. Harvard University Press.
