import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buatSesi } from './latihan.js'

test('soal latihan kilat selalu valid & bilangan bulat', () => {
  for (let k = 0; k < 300; k++) {
    for (const s of buatSesi(10)) {
      assert.ok(s.tanya && s.bahas && s.tipe)
      if (s.pg) assert.ok(s.kunci === 0 || s.kunci === 1)
      else assert.ok(Number.isInteger(s.kunci) && s.kunci > 0, `${s.tanya} -> ${s.kunci}`)
    }
  }
})
