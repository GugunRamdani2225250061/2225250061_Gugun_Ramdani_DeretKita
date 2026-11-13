// Penyimpanan lokal (di HP/browser). Aplikasi tetap jalan tanpa internet & tanpa Supabase.
import { useSyncExternalStore } from 'react'

const KEY = 'deretkita:v1'
const AWAL = {
  profil: null, // { kode, nama, kelas }
  daftarProfil: [], // profil yang pernah masuk di perangkat ini
  jawaban: [], // satu baris = satu soal selesai (format uji coba)
  angket: [],
  refleksi: [],
  progres: {}, // progres[kode][modulId] = { pos, selesai, bintang }
  pengaturan: { hurufBesar: false, modeUjiCoba: true },
}

function muat() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s) return { ...AWAL, ...s, pengaturan: { ...AWAL.pengaturan, ...s.pengaturan } }
  } catch { /* abaikan */ }
  return structuredClone(AWAL)
}

let state = muat()
const pendengar = new Set()

function simpan() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* penyimpanan penuh/diblokir */ }
}

export const getState = () => state
export function setState(fn) {
  state = { ...state, ...fn(state) }
  simpan()
  pendengar.forEach((l) => l())
}
const subscribe = (l) => { pendengar.add(l); return () => pendengar.delete(l) }
export const useStore = () => useSyncExternalStore(subscribe, getState)

// ---------- aksi ----------
const acak = () => Math.random().toString(36).slice(2, 6).toUpperCase()

export function masuk(nama, kelas) {
  const profil = { kode: `S-${acak()}`, nama: nama.trim(), kelas: kelas.trim().toUpperCase() }
  setState((s) => ({ profil, daftarProfil: [...s.daftarProfil, profil] }))
  return profil
}
export const pilihProfil = (profil) => setState(() => ({ profil }))
export const keluar = () => setState(() => ({ profil: null }))

export function simpanJawaban(row) {
  const { profil } = state
  const lengkap = { kode_siswa: profil.kode, kode_kelas: profil.kelas, waktu: new Date().toISOString(), ...row }
  setState((s) => ({ jawaban: [...s.jawaban, lengkap] }))
  return lengkap
}

export function simpanAngket(jenis, respon, skor) {
  const row = { kode_siswa: state.profil.kode, jenis, respon, skor, waktu: new Date().toISOString() }
  setState((s) => ({ angket: [...s.angket, row] }))
  return row
}

export function simpanRefleksi(modul_id, teks) {
  const row = { kode_siswa: state.profil.kode, modul_id, teks, waktu: new Date().toISOString() }
  setState((s) => ({ refleksi: [...s.refleksi, row] }))
  return row
}

export function getProgres(modulId) {
  return state.progres[state.profil?.kode]?.[modulId] || { pos: 0, selesai: false, bintang: 0 }
}
export function setProgres(modulId, data) {
  const kode = state.profil.kode
  setState((s) => ({
    progres: { ...s.progres, [kode]: { ...s.progres[kode], [modulId]: { ...getProgres(modulId), ...data } } },
  }))
}

export const setPengaturan = (data) => setState((s) => ({ pengaturan: { ...s.pengaturan, ...data } }))

export const hapusSemuaData = () => setState(() => ({ ...structuredClone(AWAL), pengaturan: state.pengaturan }))
