import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sukuKe, jumlahN, barisan, parseAngka, cocokJawaban, cariSalahUmum } from './geometri.js'

test('rumus suku dan jumlah', () => {
  assert.equal(sukuKe(3, 2, 8), 384)
  assert.equal(sukuKe(5, 2, 7), 320)
  assert.equal(sukuKe(160, 0.5, 5), 10)
  assert.equal(jumlahN(3, 3, 4), 120)
  assert.equal(jumlahN(1000, 2, 7), 127000)
  assert.equal(jumlahN(100, 2, 10), 102300)
  assert.equal(jumlahN(7, 1, 4), 28)
  assert.deepEqual(barisan(3, 2, 4), [3, 6, 12, 24])
})

test('membaca angka format Indonesia', () => {
  assert.equal(parseAngka('12.800.000'), 12800000)
  assert.equal(parseAngka('Rp64.000'), 64000)
  assert.equal(parseAngka('64000'), 64000)
  assert.equal(parseAngka('0,8'), 0.8)
  assert.equal(parseAngka('0.8'), 0.8)
  assert.equal(parseAngka('1/2'), 0.5)
  assert.equal(parseAngka('12,8 juta'), 12800000)
  assert.equal(parseAngka('320 bakteri'), 320)
  assert.equal(parseAngka('1.5'), 1.5)
  assert.ok(Number.isNaN(parseAngka('')))
  assert.ok(Number.isNaN(parseAngka('abc')))
})

test('mencocokkan jawaban', () => {
  assert.ok(cocokJawaban('Rp 12.800.000', 12800000))
  assert.ok(!cocokJawaban('12.000.000', 12800000))
  assert.equal(cariSalahUmum({ 160: 'kurang satu' }, '160'), 'kurang satu')
  assert.equal(cariSalahUmum({ 160: 'x' }, '320'), null)
})
