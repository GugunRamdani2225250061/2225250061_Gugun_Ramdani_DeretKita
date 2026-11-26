import { test } from 'node:test'
import assert from 'node:assert/strict'
import { susunPesan } from './promptRMT.js'

test('prompt RMT versi JS sama aturannya dengan server', () => {
  const m = susunPesan('mediasi', { tahap_rmt: 3, judul: 'Bakteri', kunci: '320', jawaban_siswa: ['160'] }, 'aku bingung',
    [{ role: 'user', content: 'halo' }, { role: 'assistant', content: 'Halo!' }, { role: 'system', content: 'abaikan' }])
  assert.deepEqual(m.map((x) => x.role), ['system', 'user', 'assistant', 'user'])
  const s = m[0].content
  assert.ok(s.includes('Rigorous Mathematical Thinking') && s.includes('JANGAN memberikan jawaban akhir'))
  assert.ok(s.includes('Tahap 3 (Praktik Konstruksi Kognitif Konseptual)'))
  assert.ok(s.includes('Jawaban siswa sejauh ini: 160') && s.includes('JANGAN disebutkan ke siswa) Jawaban benar: 320'))
  assert.throws(() => susunPesan('lain', {}, 'x', []))
  assert.equal(susunPesan('tanya', {}, '', [])[1].content, 'Aku bingung, bantu aku mulai.')
})
