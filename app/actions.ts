'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCustomers(query: string) {
    if (!query || query.length < 1) return []

    const customers = await prisma.customer.findMany({
        where: {
            OR: [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
            ],
        },
        take: 5,
        orderBy: { firstName: 'asc' },
    })

    return customers
}

export async function createJob(formData: FormData) {
    const customerName = formData.get('customerName') as string
    const sport = formData.get('sport') as string
    const tension = parseFloat(formData.get('tension') as string)
    const price = parseFloat(formData.get('price') as string)

    if (!customerName || !sport || isNaN(tension) || isNaN(price)) {
        throw new Error('Invalid form data')
    }

    // Split name into First and Last (simple heuristic)
    const nameParts = customerName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    // Find or Create Customer
    let customer = await prisma.customer.findFirst({
        where: {
            firstName: firstName,
            lastName: lastName
        }
    })

    if (!customer) {
        customer = await prisma.customer.create({
            data: {
                firstName,
                lastName,
                sport,
                defaultTension: tension.toString(),
                balance: 0,
            }
        })
    } else {
        // Update default tension and sport if they changed, just to keep it fresh
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                sport,
                defaultTension: tension.toString()
            }
        })
    }

    // Create Job
    await prisma.racketJob.create({
        data: {
            customerId: customer.id,
            tension,
            price,
            isDone: false,
            isPaid: false,
            isReturned: false,
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
    const job = await prisma.racketJob.findUnique({ where: { id: jobId } })
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
    const job = await prisma.racketJob.findUnique({ where: { id: jobId } })
    if (!job) return

    // If job was not paid, we need to revert the balance addition we did at creation
    // If it WAS paid, the balance was already neutralized (Creation: +Price, Payment: -Price).
    // So if it is NOT paid, the customer still has +Price debt. We need to remove that debt.
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
