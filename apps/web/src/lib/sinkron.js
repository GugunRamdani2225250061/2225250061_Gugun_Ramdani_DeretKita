// Sinkron ke Supabase (opsional). Aktif hanya jika VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY diisi.
// Data selalu disimpan lokal dulu; jika offline, dikirim nanti dari antrean.
const URL_SB = import.meta.env.VITE_SUPABASE_URL
const KEY_SB = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabaseAktif = Boolean(URL_SB && KEY_SB)

const KEY_ANTREAN = 'deretkita:antrean'
let klien = null
let profilTerkirim = null

async function getKlien() {
  if (!supabaseAktif) return null
  if (!klien) {
    const { createClient } = await import('@supabase/supabase-js')
    klien = createClient(URL_SB, KEY_SB)
  }
  return klien
}

const bacaAntrean = () => { try { return JSON.parse(localStorage.getItem(KEY_ANTREAN)) || [] } catch { return [] } }
const tulisAntrean = (q) => { try { localStorage.setItem(KEY_ANTREAN, JSON.stringify(q)) } catch { /* abaikan */ } }

async function pastikanLogin(profil) {
  const sb = await getKlien()
  if (profilTerkirim && profilTerkirim !== profil.kode) {
    await sb.auth.signOut() // ganti siswa di perangkat yang sama
    profilTerkirim = null
  }
  const { data } = await sb.auth.getSession()
  if (!data.session) {
    const { error } = await sb.auth.signInAnonymously()
    if (error) throw error
  }
  if (profilTerkirim !== profil.kode) {
    const { data: u } = await sb.auth.getUser()
    const { error } = await sb.from('profiles').upsert({
      id: u.user.id, nama_panggilan: profil.nama, kode_siswa: profil.kode, kode_kelas: profil.kelas || null,
    })
    if (error) throw error
    profilTerkirim = profil.kode
  }
}

function keBaris(tabel, row) {
  if (tabel === 'jawaban') {
    return {
      kode_siswa: row.kode_siswa, kode_kelas: row.kode_kelas || null, soal_id: row.soal_id, modul_id: row.modul_id,
      benar: row.benar === 1, skor_bagian: row.skor_bagian, waktu_detik: row.waktu_detik,
      hint_dipakai: row.hint_dipakai, ai_dipakai: row.ai_dipakai ?? 0, butuh_bantuan: row.butuh_bantuan === 1,
      persepsi: row.persepsi === '' ? null : row.persepsi, paas: row.paas, detail: row.detail,
    }
  }
  if (tabel === 'angket') return { kode_siswa: row.kode_siswa, jenis: row.jenis, respon: row.respon, skor: row.skor }
  if (tabel === 'refleksi') return { kode_siswa: row.kode_siswa, modul_id: row.modul_id, teks: row.teks }
  return row
}

let sedangKirim = false
export async function kirimAntrean(profil) {
  if (!supabaseAktif || !profil || sedangKirim || !navigator.onLine) return
  sedangKirim = true
  try {
    await pastikanLogin(profil)
    const sb = await getKlien()
    let q = bacaAntrean()
    for (const item of [...q]) {
      if (item.row.kode_siswa !== profil.kode) continue // dikirim saat siswa itu masuk lagi
      const { error } = await sb.from(item.tabel).insert(keBaris(item.tabel, item.row))
      if (error) throw error
      q = q.filter((x) => x !== item)
      tulisAntrean(q)
    }
  } catch (e) {
    console.warn('Sinkron Supabase tertunda:', e.message)
  } finally {
    sedangKirim = false
  }
}

export function antre(tabel, row, profil) {
  if (!supabaseAktif) return
  tulisAntrean([...bacaAntrean(), { tabel, row }])
  kirimAntrean(profil)
}

export const jumlahAntrean = () => bacaAntrean().length
