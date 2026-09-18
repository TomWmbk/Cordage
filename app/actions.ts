'use server'

import { db as prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getCurrentUserId } from '@/lib/auth'

// Helper function to normalize strings (remove accents and lowercase)
function normalizeString(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .toLowerCase()
}

export async function getCustomers(query: string) {
    if (!query || query.length < 1) return []

    const userId = await getCurrentUserId()

    // Fetch user's customers only
    const allCustomers = await prisma.customer.findMany({
        where: { userId },
        take: 100,
        orderBy: { firstName: 'asc' },
    })

    // Filter client-side with normalized comparison
    const normalizedQuery = normalizeString(query)
    const filteredCustomers = allCustomers
        .filter(c => normalizeString(c.firstName).includes(normalizedQuery))
        .slice(0, 5)

    return filteredCustomers.map(c => ({
        ...c,
        lastPrice: c.defaultPrice
    }))
}

export async function createJob(formData: FormData) {
    const userId = await getCurrentUserId()

    const firstName = formData.get('firstName') as string
    const sport = formData.get('sport') as string
    const tension = parseFloat(formData.get('tension') as string)
    const price = parseFloat(formData.get('price') as string)
    const standardPrice = parseFloat(formData.get('standardPrice') as string)
    const cost = parseFloat(formData.get('cost') as string) || 0

    if (!firstName || !sport || isNaN(tension) || isNaN(price)) {
        throw new Error('Invalid form data')
    }

    // Use standardPrice if available (price before credit), otherwise current price
    const priceToSave = !isNaN(standardPrice) ? standardPrice : price

    // Find or Create Customer (case and accent insensitive) - only for current user
    const allCustomers = await prisma.customer.findMany({
        where: { userId }
    })
    let customer = allCustomers.find(c =>
        normalizeString(c.firstName) === normalizeString(firstName)
    )

    if (!customer) {
        customer = await prisma.customer.create({
            data: {
                userId,
                firstName,
                sport,
                defaultTension: tension.toString(),
                defaultPrice: priceToSave,
                balance: 0,
            }
        })
    } else {
        // Update default tension, sport, and price if they changed
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                sport,
                defaultTension: tension.toString(),
                defaultPrice: priceToSave
            }
        })
    }

    const stringName = formData.get('stringName') as string

    // Create Job
    await prisma.racketJob.create({
        data: {
            userId,
            customerId: customer.id,
            tension,
            price,
            isDone: false,
            isPaid: false,
            isReturned: false,
            cost,
            stringName,
        }
    })

    // Update Customer Balance
    await prisma.customer.update({
        where: { id: customer.id },
        data: {
            balance: { increment: price }
        }
    })

    revalidatePath('/')
    revalidatePath('/stats')
}

export async function toggleJobStatus(jobId: number, field: 'isDone' | 'isPaid' | 'isReturned') {
    const userId = await getCurrentUserId()

    const job = await prisma.racketJob.findFirst({
        where: {
            id: jobId,
            userId  // Ensure user owns this job
        }
    })
    if (!job) return

    const newValue = !job[field]

    await prisma.racketJob.update({
        where: { id: jobId },
        data: { [field]: newValue }
    })

    if (field === 'isPaid') {
        const adjustment = newValue ? -job.price : job.price
        await prisma.customer.update({
            where: { id: job.customerId },
            data: {
                balance: { increment: adjustment }
            }
        })
    }

    revalidatePath('/')
    revalidatePath('/stats')
}

export async function deleteJob(jobId: number) {
    const userId = await getCurrentUserId()

    const job = await prisma.racketJob.findFirst({
        where: {
            id: jobId,
            userId  // Ensure user owns this job
        }
    })
    if (!job) return

    // If job was not paid, we need to revert the balance addition we did at creation
    if (!job.isPaid) {
        await prisma.customer.update({
            where: { id: job.customerId },
            data: {
                balance: { decrement: job.price }
            }
        })
    }

    await prisma.racketJob.delete({
        where: { id: jobId }
    })

    revalidatePath('/')
    revalidatePath('/stats')
}

export async function exportData() {
    const userId = await getCurrentUserId()

    const customers = await prisma.customer.findMany({
        where: { userId },
        include: {
            jobs: true
        }
    })
    return customers
}
