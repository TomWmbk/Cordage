export const USER_ROLES = ['stringer', 'player'] as const
export const SPORTS = ['Tennis', 'Badminton', 'Squash'] as const
export const STRING_TYPES = ['Monofilament', 'Multifilament', 'Boyau', 'Hybride', 'Synthétique'] as const

export type UserRole = (typeof USER_ROLES)[number]
export type Sport = (typeof SPORTS)[number]

type ValidationResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function boundedText(value: FormDataEntryValue | null, maximum: number): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed.length > 0 && trimmed.length <= maximum ? trimmed : null
}

function finiteNumber(value: FormDataEntryValue | null): number | null {
    if (typeof value !== 'string' || value.trim() === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
}

export function isUserRole(value: unknown): value is UserRole {
    return typeof value === 'string' && USER_ROLES.includes(value as UserRole)
}

export function destinationForRole(role: unknown): '/dashboard' | '/player/home' | '/login' {
    if (role === 'stringer') return '/dashboard'
    if (role === 'player') return '/player/home'
    return '/login'
}

export function parseRegistrationInput(input: unknown): ValidationResult<{
    username: string
    password: string
    role: UserRole
}> {
    if (!isRecord(input)) return { ok: false, error: 'Requête invalide' }

    const username = typeof input.username === 'string' ? input.username.trim().toLowerCase() : ''
    const password = typeof input.password === 'string' ? input.password : ''

    if (username.length < 3 || username.length > 50) {
        return { ok: false, error: 'Le nom d’utilisateur doit contenir entre 3 et 50 caractères' }
    }
    if (password.length < 8 || password.length > 128) {
        return { ok: false, error: 'Le mot de passe doit contenir entre 8 et 128 caractères' }
    }
    if (!isUserRole(input.role)) return { ok: false, error: 'Rôle invalide' }

    return { ok: true, data: { username, password, role: input.role } }
}

export function parseJobInput(formData: FormData): ValidationResult<{
    firstName: string
    sport: Sport
    tension: number
    price: number
    standardPrice: number
    cost: number
    stringId: number | null
}> {
    const firstName = boundedText(formData.get('firstName'), 80)
    const sport = formData.get('sport')
    const tension = finiteNumber(formData.get('tension'))
    const price = finiteNumber(formData.get('price'))
    const standardPrice = finiteNumber(formData.get('standardPrice')) ?? price
    const cost = finiteNumber(formData.get('cost')) ?? 0
    const rawStringId = finiteNumber(formData.get('stringId'))

    if (!firstName) return { ok: false, error: 'Prénom invalide' }
    if (typeof sport !== 'string' || !SPORTS.includes(sport as Sport)) {
        return { ok: false, error: 'Sport invalide' }
    }
    if (tension === null || tension <= 0 || tension > 50) {
        return { ok: false, error: 'Tension invalide' }
    }
    if (price === null || price < 0 || price > 10_000 || standardPrice === null || standardPrice < price || standardPrice > 10_000) {
        return { ok: false, error: 'Prix invalide' }
    }
    if (cost < 0 || cost > 10_000) return { ok: false, error: 'Coût invalide' }
    if (rawStringId !== null && (!Number.isInteger(rawStringId) || rawStringId <= 0)) {
        return { ok: false, error: 'Cordage invalide' }
    }

    return {
        ok: true,
        data: {
            firstName,
            sport: sport as Sport,
            tension,
            price,
            standardPrice,
            cost,
            stringId: rawStringId,
        },
    }
}

export function parseStringReferenceInput(formData: FormData): ValidationResult<{
    brand: string
    model: string
    gauge: string | null
    price: number
    type: string | null
    isInStock: boolean
}> {
    const brand = boundedText(formData.get('brand'), 80)
    const model = boundedText(formData.get('model'), 120)
    const gaugeValue = formData.get('gauge')
    const gauge = typeof gaugeValue === 'string' && gaugeValue.trim() ? gaugeValue.trim().slice(0, 20) : null
    const price = finiteNumber(formData.get('price'))
    const typeValue = formData.get('type')
    const type = typeof typeValue === 'string' && typeValue ? typeValue : null

    if (!brand) return { ok: false, error: 'Marque invalide' }
    if (!model) return { ok: false, error: 'Modèle invalide' }
    if (price === null || price <= 0 || price > 10_000) return { ok: false, error: 'Prix invalide' }
    if (type !== null && !STRING_TYPES.includes(type as (typeof STRING_TYPES)[number])) {
        return { ok: false, error: 'Type invalide' }
    }

    return {
        ok: true,
        data: {
            brand,
            model,
            gauge,
            price,
            type,
            isInStock: formData.get('isInStock') === 'on',
        },
    }
}

export function balanceAdjustmentForPaidToggle(price: number, currentlyPaid: boolean): number {
    return currentlyPaid ? price : -price
}
