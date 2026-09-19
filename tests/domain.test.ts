import assert from 'node:assert/strict'
import test from 'node:test'

import {
    balanceAdjustmentForPaidToggle,
    canToggleJobStatus,
    destinationForRole,
    isJobStatusField,
    parseJobInput,
    parseRegistrationInput,
    parseStringReferenceInput,
} from '../lib/domain.ts'

function formData(values: Record<string, string>): FormData {
    const data = new FormData()
    Object.entries(values).forEach(([key, value]) => data.set(key, value))
    return data
}

test('registration rejects roles outside the public role allowlist', () => {
    const result = parseRegistrationInput({
        username: 'alice',
        password: 'mot-de-passe-solide',
        role: 'admin',
    })

    assert.deepEqual(result, { ok: false, error: 'Rôle invalide' })
})

test('player registration stays disabled while the player product is hidden', () => {
    const result = parseRegistrationInput({
        username: 'alice',
        password: 'mot-de-passe-solide',
        role: 'player',
    })

    assert.deepEqual(result, { ok: false, error: 'Rôle invalide' })
})

test('registration trims and normalizes a valid username', () => {
    const result = parseRegistrationInput({
        username: '  Alice  ',
        password: 'mot-de-passe-solide',
        role: 'stringer',
    })

    assert.deepEqual(result, {
        ok: true,
        data: {
            username: 'alice',
            password: 'mot-de-passe-solide',
            role: 'stringer',
        },
    })
})

test('authenticated role alone determines its destination', () => {
    assert.equal(destinationForRole('player'), '/login?role=stringer')
    assert.equal(destinationForRole('stringer'), '/dashboard')
    assert.equal(destinationForRole('unexpected'), '/login?role=stringer')
})

test('job input rejects negative prices and unsupported sports', () => {
    const negativePrice = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Tennis',
        tension: '24',
        price: '-2',
        standardPrice: '25',
        cost: '5',
    }))
    const unsupportedSport = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Football',
        tension: '24',
        price: '25',
        standardPrice: '25',
        cost: '5',
    }))

    assert.deepEqual(negativePrice, { ok: false, error: 'Prix invalide' })
    assert.deepEqual(unsupportedSport, { ok: false, error: 'Sport invalide' })
})

test('job input rejects a discounted price above its standard price', () => {
    const result = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Tennis',
        tension: '24',
        price: '30',
        standardPrice: '25',
        cost: '5',
    }))

    assert.deepEqual(result, { ok: false, error: 'Prix invalide' })
})

test('job input returns bounded numeric values for a valid form', () => {
    const result = parseJobInput(formData({
        firstName: '  Alice  ',
        sport: 'Badminton',
        tension: '12.5',
        price: '22',
        standardPrice: '25',
        cost: '4.5',
        stringId: '12',
    }))

    assert.deepEqual(result, {
        ok: true,
        data: {
            firstName: 'Alice',
            sport: 'Badminton',
            tension: 12.5,
            price: 22,
            standardPrice: 25,
            cost: 4.5,
            stringId: 12,
        },
    })
})

test('string reference input requires a positive finite price', () => {
    const result = parseStringReferenceInput(formData({
        brand: 'Babolat',
        model: 'RPM Blast',
        price: 'NaN',
    }))

    assert.deepEqual(result, { ok: false, error: 'Prix invalide' })
})

test('paid status transitions adjust the balance in opposite directions', () => {
    assert.equal(balanceAdjustmentForPaidToggle(25, false), -25)
    assert.equal(balanceAdjustmentForPaidToggle(25, true), 25)
})

test('a racket cannot be returned before the stringing is done', () => {
    assert.equal(canToggleJobStatus({ isDone: false, isReturned: false }, 'isReturned'), false)
    assert.equal(canToggleJobStatus({ isDone: true, isReturned: false }, 'isReturned'), true)
})

test('payment stays independent while a returned racket cannot become unfinished', () => {
    assert.equal(canToggleJobStatus({ isDone: false, isReturned: false }, 'isPaid'), true)
    assert.equal(canToggleJobStatus({ isDone: true, isReturned: true }, 'isDone'), false)
    assert.equal(canToggleJobStatus({ isDone: true, isReturned: true }, 'isReturned'), true)
})

test('job status fields are runtime allowlisted at the server boundary', () => {
    assert.equal(isJobStatusField('isDone'), true)
    assert.equal(isJobStatusField('isPaid'), true)
    assert.equal(isJobStatusField('isReturned'), true)
    assert.equal(isJobStatusField('userId'), false)
    assert.equal(isJobStatusField(undefined), false)
})
