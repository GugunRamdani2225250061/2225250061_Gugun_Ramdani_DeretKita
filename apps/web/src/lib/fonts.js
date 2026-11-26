// Font yang bisa dipilih siswa. Disimpan di dalam aplikasi (bukan dari internet) agar jalan offline.
// Browser hanya mengunduh file font yang sedang dipakai.
import '@fontsource/lexend/latin-400.css'
import '@fontsource/lexend/latin-700.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import '@fontsource/fredoka/latin-400.css'
import '@fontsource/fredoka/latin-600.css'
import '@fontsource/comic-neue/latin-400.css'
import '@fontsource/comic-neue/latin-700.css'

export const FONT = [
  { id: 'sistem', nama: 'Bawaan HP', ket: 'Huruf standar perangkat', css: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { id: 'lexend', nama: 'Lexend', ket: 'Dirancang agar mudah & cepat dibaca', css: "'Lexend', system-ui, sans-serif" },
  { id: 'nunito', nama: 'Nunito', ket: 'Bulat dan ramah', css: "'Nunito', system-ui, sans-serif" },
  { id: 'poppins', nama: 'Poppins', ket: 'Modern dan tegas', css: "'Poppins', system-ui, sans-serif" },
  { id: 'atkinson', nama: 'Atkinson Hyperlegible', ket: 'Jelas untuk penglihatan lemah', css: "'Atkinson Hyperlegible', system-ui, sans-serif" },
  { id: 'fredoka', nama: 'Fredoka', ket: 'Ceria dan membulat', css: "'Fredoka', system-ui, sans-serif" },
  { id: 'comic', nama: 'Comic Neue', ket: 'Santai seperti tulisan tangan', css: "'Comic Neue', 'Comic Sans MS', system-ui, sans-serif" },
]

export const UKURAN = [
  { id: 'kecil', nama: 'Kecil', skala: '93%' },
  { id: 'normal', nama: 'Normal', skala: '100%' },
  { id: 'besar', nama: 'Besar', skala: '115%' },
  { id: 'sangat-besar', nama: 'Sangat besar', skala: '130%' },
]

export function terapkanHuruf(fontId, ukuranId) {
  const f = FONT.find((x) => x.id === fontId) || FONT[0]
  const u = UKURAN.find((x) => x.id === ukuranId) || UKURAN[1]
  const el = document.documentElement
  el.style.setProperty('--font', f.css)
  el.style.fontSize = u.skala
  el.dataset.font = f.id
}
