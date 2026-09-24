'use server'

import { requireRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { parsePricingSettingsInput } from '@/lib/domain'
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
