'use server'

import { requireRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { parsePricingSettingsInput, parseProfileSettingsInput } from '@/lib/domain'
import { revalidatePath } from 'next/cache'

export async function updatePricingSettings(formData: FormData) {
    const { id: userId } = await requireRole('stringer')
    const parsed = parsePricingSettingsInput(formData)
    if (!parsed.ok) throw new Error(parsed.error)

    await db.user.update({
        where: { id: userId },
        data: parsed.data,
    })

    revalidatePath('/settings')
    revalidatePath('/dashboard')
}

export async function updateProfileSettings(formData: FormData) {
    const { id: userId } = await requireRole('stringer')
    const parsed = parseProfileSettingsInput(formData)
    if (!parsed.ok) throw new Error(parsed.error)

    const conflict = await db.user.findFirst({
        where: {
            id: { not: userId },
            OR: [{ username: parsed.data.username }, { email: parsed.data.email }],
        },
        select: { username: true, email: true },
    })
    if (conflict?.username === parsed.data.username) {
        throw new Error('Ce nom d’utilisateur est déjà utilisé')
    }
    if (conflict?.email === parsed.data.email) {
        throw new Error('Cette adresse e-mail est déjà utilisée')
    }

    await db.user.update({
        where: { id: userId },
        data: parsed.data,
    })

    revalidatePath('/settings')
    return parsed.data
}
