export type RateLimitResult =
    | { allowed: true; retryAfterSeconds: 0 }
    | { allowed: false; retryAfterSeconds: number }

type Bucket = {
    count: number
    resetAt: number
}

export class FixedWindowRateLimiter {
    private readonly buckets = new Map<string, Bucket>()
    private readonly limit: number
    private readonly windowMs: number
    private readonly maxKeys: number

    constructor(
        limit: number,
        windowMs: number,
        maxKeys = 10_000,
    ) {
        if (!Number.isSafeInteger(limit) || limit <= 0) throw new Error('Invalid rate limit')
        if (!Number.isSafeInteger(windowMs) || windowMs <= 0) throw new Error('Invalid rate limit window')
        if (!Number.isSafeInteger(maxKeys) || maxKeys <= 0) throw new Error('Invalid rate limit capacity')
        this.limit = limit
        this.windowMs = windowMs
        this.maxKeys = maxKeys
    }

    check(key: string, now = Date.now()): RateLimitResult {
        const bucket = this.buckets.get(key)

        if (!bucket || now >= bucket.resetAt) {
            this.prune(now)
            if (this.buckets.size >= this.maxKeys && !this.buckets.has(key)) {
                return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(this.windowMs / 1_000)) }
            }
            this.buckets.set(key, { count: 1, resetAt: now + this.windowMs })
            return { allowed: true, retryAfterSeconds: 0 }
        }

        if (bucket.count >= this.limit) {
            return {
                allowed: false,
                retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
            }
        }

        bucket.count += 1
        return { allowed: true, retryAfterSeconds: 0 }
    }

    private prune(now: number) {
        for (const [key, bucket] of this.buckets) {
            if (now >= bucket.resetAt) this.buckets.delete(key)
        }
    }
}
