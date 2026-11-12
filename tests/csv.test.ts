import assert from 'node:assert/strict'
import test from 'node:test'
import { csvCell, jobsCsv } from '../lib/csv.ts'

test('CSV exports semicolon-delimited job rows, French decimals and escaped fields', () => {
    const csv = jobsCsv([{ firstName: 'Jean; "Test"', sport: 'Tennis', jobs: [{ id: 1, createdAt: new Date('2026-11-12T10:00:00Z'), racketBrand: 'Yonex', racketModel: null, tension: '24', stringName: 'BG65', stringSource: 'shop', price: 18.5, materialCost: null, cost: 0, isDone: true, isPaid: false, isReturned: true }] }])
    assert.ok(csv.startsWith('\uFEFF'))
    assert.ok(csv.includes('"Jean; ""Test"""'))
    assert.ok(csv.includes(';18,50;;Oui;Non;Oui'))
    assert.equal(csv.split('\r\n').length, 2)
})
test('CSV keeps headers with no jobs and neutralizes spreadsheet formulas', () => {
    assert.equal(jobsCsv([]).split('\r\n').length, 1)
    assert.equal(csvCell('=1+1'),"'=1+1")
    assert.equal(csvCell('  @SUM(A1)'),"'  @SUM(A1)")
})
