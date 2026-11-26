import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bersihkan } from './gratis.js'

test('jawaban AI gratis dibersihkan dari LaTeX & blok berpikir', () => {
  assert.equal(bersihkan('<think>x</think>Pangkatnya \\(n-1\\) karena \\(r^{n-1}\\).'), 'Pangkatnya n-1 karena r^(n-1).')
  assert.equal(bersihkan('U = a \\cdot r, \\frac{a}{b}'), 'U = a · r, (a)/(b)')
})
