export const USER_ROLES = ['stringer', 'player'] as const
export const PUBLIC_USER_ROLES = ['stringer'] as const
export const SPORTS = ['Tennis', 'Badminton', 'Squash'] as const
export const STRING_TYPES = ['Monofilament', 'Multifilament', 'Boyau', 'Hybride', 'Synthétique'] as const
export const STRING_SOURCES = ['shop', 'player'] as const

export type UserRole = (typeof USER_ROLES)[number]
export type Sport = (typeof SPORTS)[number]
export type StringSource = (typeof STRING_SOURCES)[number]

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

export function destinationForRole(role: unknown): '/dashboard' | '/login?role=stringer' {
    if (role === 'stringer') return '/dashboard'
    return '/login?role=stringer'
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
    if (typeof input.role !== 'string' || !PUBLIC_USER_ROLES.includes(input.role as 'stringer')) {
        return { ok: false, error: 'Rôle invalide' }
    }

    return { ok: true, data: { username, password, role: 'stringer' } }
}

export function parseJobInput(formData: FormData): ValidationResult<{
    firstName: string
    sport: Sport
    tension: number
    stringSource: StringSource
    playerStringName: string | null
    discount: number
    cost: number
    stringId: number | null
}> {
    const firstName = boundedText(formData.get('firstName'), 80)
    const sport = formData.get('sport')
    const tension = finiteNumber(formData.get('tension'))
    const stringSource = formData.get('stringSource')
    const playerStringNameValue = formData.get('playerStringName')
    const playerStringName = typeof playerStringNameValue === 'string' && playerStringNameValue.trim()
        ? playerStringNameValue.trim().slice(0, 120)
        : null
    const discount = finiteNumber(formData.get('discount')) ?? 0
    const cost = finiteNumber(formData.get('cost')) ?? 0
    const rawStringId = finiteNumber(formData.get('stringId'))

    if (!firstName) return { ok: false, error: 'Prénom invalide' }
    if (typeof sport !== 'string' || !SPORTS.includes(sport as Sport)) {
        return { ok: false, error: 'Sport invalide' }
    }
    if (tension === null || tension <= 0 || tension > 50) {
        return { ok: false, error: 'Tension invalide' }
    }
    if (typeof stringSource !== 'string' || !STRING_SOURCES.includes(stringSource as StringSource)) {
        return { ok: false, error: 'Source du cordage invalide' }
    }
    if (discount < 0 || discount > 10_000) return { ok: false, error: 'Remise invalide' }
    if (cost < 0 || cost > 10_000) return { ok: false, error: 'Coût invalide' }
    if (stringSource === 'shop' && (rawStringId === null || !Number.isInteger(rawStringId) || rawStringId <= 0)) {
        return { ok: false, error: 'Cordage atelier requis' }
    }
    if (rawStringId !== null && (!Number.isInteger(rawStringId) || rawStringId <= 0)) {
        return { ok: false, error: 'Cordage invalide' }
    }

    return {
        ok: true,
        data: {
            firstName,
            sport: sport as Sport,
            tension,
            stringSource: stringSource as StringSource,
            playerStringName,
            discount,
            cost,
            stringId: stringSource === 'shop' ? rawStringId : null,
        },
    }
}

export function calculateJobPrice({
    laborPrice,
    stringPrice,
    stringSource,
    discount,
}: {
    laborPrice: number
    stringPrice: number | null
    stringSource: StringSource
    discount: number
}): number {
    const standardPrice = laborPrice + (stringSource === 'shop' ? (stringPrice ?? 0) : 0)
    return Math.max(0, Math.round((standardPrice - discount) * 100) / 100)
}

export function parsePricingSettingsInput(formData: FormData): ValidationResult<{ laborPrice: number }> {
    const laborPrice = finiteNumber(formData.get('laborPrice'))
    if (laborPrice === null || laborPrice < 0 || laborPrice > 10_000) {
        return { ok: false, error: 'Prix de pose invalide' }
    }
    return { ok: true, data: { laborPrice } }
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

export const JOB_STATUS_FIELDS = ['isDone', 'isPaid', 'isReturned'] as const
export type JobStatusField = (typeof JOB_STATUS_FIELDS)[number]

export function isJobStatusField(value: unknown): value is JobStatusField {
    return typeof value === 'string' && JOB_STATUS_FIELDS.includes(value as JobStatusField)
}

export function canToggleJobStatus(
    job: { isDone: boolean; isReturned: boolean },
    field: JobStatusField,
): boolean {
    if (field === 'isReturned' && !job.isReturned) return job.isDone
    if (field === 'isDone' && job.isDone && job.isReturned) return false
    return true
}
