// Memastikan konten valid & kunci jawaban benar (dihitung ulang dengan rumus).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MODUL } from './modul.js'
import { SOAL } from './soal.js'
import { sukuKe, jumlahN } from '../lib/geometri.js'

test('setiap soal di modul ada di bank soal', () => {
  for (const m of MODUL) for (const id of m.soal) assert.ok(SOAL[id], `${m.id}: soal ${id} tidak ada`)
})

test('struktur setiap bagian soal valid', () => {
  for (const [id, s] of Object.entries(SOAL)) {
    assert.ok(s.bagian.length > 0, id)
    for (const b of s.bagian) {
      if (b.tipe === 'pg') {
        assert.ok(Number.isInteger(b.kunci) && b.kunci >= 0 && b.kunci < b.opsi.length, `${id}: kunci pg di luar opsi`)
        for (const k of Object.keys(b.salah || {})) assert.ok(+k !== b.kunci, `${id}: umpan salah memakai kunci benar`)
      } else {
        assert.equal(b.tipe, 'isian', id)
        assert.ok(Number.isFinite(b.kunci), `${id}: kunci isian bukan angka`)
        for (const k of Object.keys(b.salah || {})) assert.ok(+k !== b.kunci, `${id}: umpan salah memakai kunci benar`)
      }
      assert.ok(b.bahas, `${id}: pembahasan kosong`)
    }
  }
})

test('kunci jawaban sesuai rumus', () => {
  const k = (id, i) => SOAL[id].bagian[i].kunci
  assert.equal(k('G01', 1), sukuKe(3, 2, 8))
  assert.equal(k('G03', 1), sukuKe(2, 2, 5))
  assert.equal(k('G04', 2), sukuKe(5, 2, 7))
  assert.equal(k('G05', 1), sukuKe(80, 0.5, 4))
  assert.equal(k('G06', 1), sukuKe(200, 0.5, 4))
  assert.equal(k('G07', 0), sukuKe(3, 3, 4))
  assert.equal(k('G08', 1), jumlahN(3, 3, 4))
  assert.equal(k('G09', 0), sukuKe(1000, 2, 7))
  assert.equal(k('G09', 1), jumlahN(1000, 2, 7))
  assert.ok(Math.abs(k('G10', 2) - sukuKe(20000000, 0.8, 3)) < 1e-6)
  assert.equal(k('G11', 1), sukuKe(5, 2, 6))
  assert.equal(k('G13', 2), jumlahN(100, 2, 10))
  assert.ok(jumlahN(100, 2, 9) < 90000) // dasar kunci G13 bagian 4
})

test('langkah contoh yang kosong punya kunci', () => {
  for (const m of MODUL) for (const s of m.segmen) {
    if (s.jenis !== 'contoh') continue
    for (const l of s.langkah) if (typeof l !== 'string') assert.ok(Number.isFinite(l.kosong.kunci), `${m.id} ${s.judul}`)
  }
})
