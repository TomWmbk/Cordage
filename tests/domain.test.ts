import assert from 'node:assert/strict'
import test from 'node:test'

import {
    balanceAdjustmentForPaidToggle,
    calculateJobPrice,
    canToggleJobStatus,
    destinationForRole,
    isJobStatusField,
    parseJobInput,
    parsePricingSettingsInput,
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
    const excessiveDiscount = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Tennis',
        tension: '24',
        stringSource: 'shop',
        stringId: '1',
        discount: '-2',
        cost: '5',
    }))
    const unsupportedSport = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Football',
        tension: '24',
        stringSource: 'player',
        discount: '0',
        cost: '5',
    }))

    assert.deepEqual(excessiveDiscount, { ok: false, error: 'Remise invalide' })
    assert.deepEqual(unsupportedSport, { ok: false, error: 'Sport invalide' })
})

test('job input requires an atelier reference only for an atelier string', () => {
    const missingAtelierString = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Tennis',
        tension: '24',
        stringSource: 'shop',
        discount: '0',
    }))
    const playerString = parseJobInput(formData({
        firstName: 'Alice',
        sport: 'Tennis',
        tension: '24',
        stringSource: 'player',
        playerStringName: '  Wilson Revolve 1.25  ',
        discount: '0',
    }))

    assert.deepEqual(missingAtelierString, { ok: false, error: 'Cordage atelier requis' })
    assert.equal(playerString.ok, true)
    if (playerString.ok) {
        assert.equal(playerString.data.stringId, null)
        assert.equal(playerString.data.playerStringName, 'Wilson Revolve 1.25')
    }
})

test('job input returns bounded numeric values for a valid form', () => {
    const result = parseJobInput(formData({
        firstName: '  Alice  ',
        sport: 'Badminton',
        tension: '12.5',
        stringSource: 'shop',
        discount: '3',
        cost: '4.5',
        stringId: '12',
    }))

    assert.deepEqual(result, {
        ok: true,
        data: {
            firstName: 'Alice',
            sport: 'Badminton',
            tension: 12.5,
            stringSource: 'shop',
            playerStringName: null,
            discount: 3,
            cost: 4.5,
            stringId: 12,
        },
    })
})

test('atelier pricing adds labor and string while player reel pricing charges labor only', () => {
    assert.equal(calculateJobPrice({ laborPrice: 12, stringPrice: 8, stringSource: 'shop', discount: 0 }), 20)
    assert.equal(calculateJobPrice({ laborPrice: 12, stringPrice: null, stringSource: 'player', discount: 0 }), 12)
    assert.equal(calculateJobPrice({ laborPrice: 12, stringPrice: 8, stringSource: 'shop', discount: 3.5 }), 16.5)
})

test('job pricing never becomes negative after a discount', () => {
    assert.equal(calculateJobPrice({ laborPrice: 10, stringPrice: null, stringSource: 'player', discount: 25 }), 0)
})

test('pricing settings accept a bounded pose price and reject invalid values', () => {
    assert.deepEqual(parsePricingSettingsInput(formData({ laborPrice: '12.5' })), {
        ok: true,
        data: { laborPrice: 12.5 },
    })
    assert.deepEqual(parsePricingSettingsInput(formData({ laborPrice: '-1' })), {
        ok: false,
        error: 'Prix de pose invalide',
    })
    assert.deepEqual(parsePricingSettingsInput(formData({ laborPrice: 'NaN' })), {
        ok: false,
        error: 'Prix de pose invalide',
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
