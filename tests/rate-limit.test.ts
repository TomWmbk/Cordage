import assert from 'node:assert/strict'
import test from 'node:test'

import { FixedWindowRateLimiter } from '../lib/rate-limit.ts'

test('authentication attempts are blocked after the configured limit', () => {
    const limiter = new FixedWindowRateLimiter(3, 60_000)

    assert.equal(limiter.check('client-a', 1_000).allowed, true)
    assert.equal(limiter.check('client-a', 2_000).allowed, true)
    assert.equal(limiter.check('client-a', 3_000).allowed, true)

    const blocked = limiter.check('client-a', 4_000)
    assert.equal(blocked.allowed, false)
    assert.equal(blocked.retryAfterSeconds, 57)
})

test('authentication limits are isolated by client and reset after the window', () => {
    const limiter = new FixedWindowRateLimiter(1, 60_000)

    assert.equal(limiter.check('client-a', 1_000).allowed, true)
    assert.equal(limiter.check('client-a', 2_000).allowed, false)
    assert.equal(limiter.check('client-b', 2_000).allowed, true)
    assert.equal(limiter.check('client-a', 61_001).allowed, true)
})
