import test from 'node:test'
import assert from 'node:assert/strict'
import { activityStats, type ActivityJob } from '../lib/activity-stats.ts'

const job: ActivityJob = { createdAt: '2026-05-01T12:00:00Z', price: 20, cost: 0, materialCost: 4, isDone: true, isPaid: true, isReturned: true, customerId: 1, stringName: 'Yonex BG65', stringSource: 'shop', stringReferenceId: 1 }
test('annual figures count paid receipts, consumed material, unpaid returns and unknown costs', () => {
    const result = activityStats([job, {...job, isPaid:false}, {...job, materialCost:null}, {...job, createdAt:'2025-01-01T00:00:00Z'}],2026)
    assert.equal(result.revenue,40)
    assert.equal(result.costs,8)
    assert.equal(result.margin,32)
    assert.equal(result.unknown,1)
    assert.equal(result.returnedUnpaid,20)
    assert.equal(result.volume,3)
    assert.equal(result.reels[0].volume,3)
    assert.equal(result.months[4].revenue,40)
})
test('player reels have no material cost and empty years have zero averages', () => {
    assert.equal(activityStats([{...job,stringSource:'player',materialCost:null}],2026).unknown,0)
    assert.equal(activityStats([],2026).average,0)
})
