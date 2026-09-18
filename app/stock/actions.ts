'use server'

import { db as prisma } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getStringReferences() {
    const userId = await getCurrentUserId()
    if (!userId) return []

    return prisma.stringReference.findMany({
        where: { userId },
        orderBy: { brand: 'asc' }
    })
}

export async function createStringReference(formData: FormData) {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Unauthorized')

    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const gauge = formData.get('gauge') as string
    const price = parseFloat(formData.get('price') as string)
    const type = formData.get('type') as string
    const isInStock = formData.get('isInStock') === 'on'

    await prisma.stringReference.create({
        data: {
            userId,
            brand,
            model,
            gauge,
            price,
            type,
            isInStock
        }
    })

    revalidatePath('/stock')
    revalidatePath('/') // For the new job form
}

export async function updateStringReference(id: number, formData: FormData) {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Unauthorized')

    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const gauge = formData.get('gauge') as string
    const price = parseFloat(formData.get('price') as string)
    const type = formData.get('type') as string
    const isInStock = formData.get('isInStock') === 'on'

    // Verify ownership
    const existing = await prisma.stringReference.findFirst({
        where: { id, userId }
    })

    if (!existing) throw new Error('Not found or unauthorized')

    await prisma.stringReference.update({
        where: { id },
        data: {
            brand,
            model,
            gauge,
            price,
            type,
            isInStock
        }
    })

    revalidatePath('/stock')
    revalidatePath('/')
}

export async function deleteStringReference(id: number) {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Unauthorized')

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
