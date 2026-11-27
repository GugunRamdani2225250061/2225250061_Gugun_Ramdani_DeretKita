// Uji server Cloudflare tanpa akun: env.AI diganti AI palsu.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker, { teksJawaban, cekBatas, daftarModel, MODEL_DEFAULT } from '../src/index.js'

const minta = (path, body, ip = '1.2.3.4') => new Request(`https://deretkita-ai.contoh.workers.dev${path}`, {
  method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip }, body: body ? JSON.stringify(body) : undefined,
})

test('status & CORS', async () => {
  const r = await worker.fetch(minta('/ai/status'), { AI: {} })
  const d = await r.json()
  assert.equal(d.aktif, true)
  assert.equal(d.model, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b')
  assert.equal(r.headers.get('Access-Control-Allow-Origin'), '*')
  const pre = await worker.fetch(new Request('https://x.dev/ai', { method: 'OPTIONS' }), {})
  assert.equal(pre.status, 204)
})

test('POST /ai memakai prompt RMT & membuang blok berpikir DeepSeek', async () => {
  const dipanggil = []
  const AI = { run: async (model, opsi) => { dipanggil.push({ model, opsi }); return { response: '<think>hitung dulu...</think>Coba bagi 6 dengan 3. Apa hasilnya?' } } }
  const r = await worker.fetch(minta('/ai', { mode: 'mediasi', pesan: 'Kenapa salah?', konteks: { tahap_rmt: 3, kunci: '2', jawaban_siswa: ['3'] } }), { AI })
  const d = await r.json()
  assert.equal(r.status, 200)
  assert.equal(d.jawaban, 'Coba bagi 6 dengan 3. Apa hasilnya?')
  assert.equal(dipanggil[0].model, MODEL_DEFAULT[0])
  const sistem = dipanggil[0].opsi.messages[0].content
  assert.ok(sistem.includes('Rigorous Mathematical Thinking') && sistem.includes('Tahap 3') && sistem.includes('JANGAN disebutkan'))
  assert.equal(dipanggil[0].opsi.max_tokens, 1500)
})

test('model cadangan dipakai jika model pertama gagal', async () => {
  const dicoba = []
  const AI = { run: async (model) => { dicoba.push(model); if (model.includes('deepseek')) throw new Error('model error'); return { response: 'Jawaban cadangan' } } }
  const d = await (await worker.fetch(minta('/ai', { mode: 'tanya', pesan: 'halo' }, '5.5.5.5'), { AI })).json()
  assert.equal(d.jawaban, 'Jawaban cadangan')
  assert.deepEqual(dicoba, MODEL_DEFAULT.slice(0, 2))
})

test('kuota habis -> pesan jelas 429', async () => {
  const AI = { run: async () => { throw new Error('4006: you have used up your daily free allocation of 10,000 neurons') } }
  const r = await worker.fetch(minta('/ai', { mode: 'tanya', pesan: 'x' }, '6.6.6.6'), { AI })
  assert.equal(r.status, 429)
  assert.match((await r.json()).detail, /Kuota AI gratis/)
})

test('bentuk respons lain & pembatas per IP & model dari pengaturan', () => {
  assert.equal(teksJawaban({ choices: [{ message: { content: 'A \\(n-1\\)' } }] }), 'A n-1')
  assert.equal(teksJawaban({ response: '<think>panjang tanpa penutup' }), 'panjang tanpa penutup')
  for (let i = 0; i < 3; i++) assert.ok(cekBatas('9.9.9.9', 1000 + i, 3))
  assert.equal(cekBatas('9.9.9.9', 2000, 3), false)
  assert.ok(cekBatas('9.9.9.9', 1000 + 11 * 60 * 1000, 3))
  assert.deepEqual(daftarModel({ AI_MODEL: '@cf/a, @cf/b' }), ['@cf/a', '@cf/b'])
})
