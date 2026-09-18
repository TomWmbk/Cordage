'use server'

import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { parseStringReferenceInput } from '@/lib/domain'

export async function getStringReferences() {
    const { id: userId } = await requireRole('stringer')

    return prisma.stringReference.findMany({
        where: { userId },
        orderBy: { brand: 'asc' },
        select: {
            id: true,
            brand: true,
            model: true,
            gauge: true,
            price: true,
            type: true,
            isInStock: true,
        },
    })
}

export async function createStringReference(formData: FormData) {
    const { id: userId } = await requireRole('stringer')
    const parsed = parseStringReferenceInput(formData)
    if (!parsed.ok) throw new Error(parsed.error)

    await prisma.stringReference.create({
        data: {
            userId,
            ...parsed.data,
        }
    })

    revalidatePath('/stock')
    revalidatePath('/') // For the new job form
}

export async function updateStringReference(id: number, formData: FormData) {
    const { id: userId } = await requireRole('stringer')
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Référence invalide')
    const parsed = parseStringReferenceInput(formData)
    if (!parsed.ok) throw new Error(parsed.error)

    // Verify ownership
    const existing = await prisma.stringReference.findFirst({
        where: { id, userId }
    })

    if (!existing) throw new Error('Not found or unauthorized')

    await prisma.stringReference.update({
        where: { id },
        data: {
            ...parsed.data,
        }
    })

    revalidatePath('/stock')
    revalidatePath('/')
}

export async function deleteStringReference(id: number) {
    const { id: userId } = await requireRole('stringer')
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Référence invalide')

    // Verify ownership
    const existing = await prisma.stringReference.findFirst({
        where: { id, userId }
    })

    if (!existing) throw new Error('Not found or unauthorized')

    await prisma.stringReference.delete({
        where: { id }
    })

    revalidatePath('/stock')
    revalidatePath('/')
}
