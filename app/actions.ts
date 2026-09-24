'use server'

import { db as prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { balanceAdjustmentForPaidToggle, calculateJobPrice, canToggleJobStatus, isJobStatusField, parseJobInput } from '@/lib/domain'

// Helper function to normalize strings (remove accents and lowercase)
function normalizeString(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .toLowerCase()
}

export async function getCustomers(query: string) {
    const normalizedInput = query.trim().slice(0, 80)
    if (!normalizedInput) return []

    const { id: userId } = await requireRole('stringer')

    // Fetch user's customers only
    const allCustomers = await prisma.customer.findMany({
        where: { userId },
        take: 1_000,
        orderBy: { firstName: 'asc' },
        select: {
            id: true,
            firstName: true,
            sport: true,
            defaultTension: true,
        },
    })

    // Filter client-side with normalized comparison
    const normalizedQuery = normalizeString(normalizedInput)
    const filteredCustomers = allCustomers
        .filter(c => normalizeString(c.firstName).includes(normalizedQuery))
        .slice(0, 5)

    return filteredCustomers
}

export async function createJob(formData: FormData) {
    const { id: userId, laborPrice } = await requireRole('stringer')
    const parsed = parseJobInput(formData)
    if (!parsed.ok) throw new Error(parsed.error)
    const { firstName, sport, tension, stringSource, playerStringName, discount, cost, stringId } = parsed.data

    await prisma.$transaction(async (transaction) => {
        const selectedString = stringSource === 'player' || stringId === null
            ? null
            : await transaction.stringReference.findFirst({
                where: { id: stringId, userId, isInStock: true },
                select: { brand: true, model: true, gauge: true, price: true },
            })

        if (stringSource === 'shop' && !selectedString) throw new Error('Cordage indisponible')

        const stringName = stringSource === 'player'
            ? playerStringName || 'Bobine du joueur'
            : selectedString
                ? [selectedString.brand, selectedString.model, selectedString.gauge].filter(Boolean).join(' ')
                : null
        const standardPrice = calculateJobPrice({
            laborPrice,
            stringPrice: selectedString?.price ?? null,
            stringSource,
            discount: 0,
        })
        const price = calculateJobPrice({
            laborPrice,
            stringPrice: selectedString?.price ?? null,
            stringSource,
            discount,
        })

        const allCustomers = await transaction.customer.findMany({
            where: { userId },
            take: 1_000,
        })
        let customer = allCustomers.find((candidate) =>
            normalizeString(candidate.firstName) === normalizeString(firstName)
        )

        if (!customer) {
            customer = await transaction.customer.create({
                data: {
                    userId,
                    firstName,
                    sport,
                    defaultTension: tension.toString(),
                    defaultPrice: standardPrice,
                },
            })
        } else {
            customer = await transaction.customer.update({
                where: { id: customer.id },
                data: {
                    sport,
                    defaultTension: tension.toString(),
                    defaultPrice: standardPrice,
                },
            })
        }

        await transaction.racketJob.create({
            data: {
                userId,
                customerId: customer.id,
                tension,
                price,
                cost,
                stringName,
                stringSource,
            },
        })

        await transaction.customer.update({
            where: { id: customer.id },
            data: { balance: { increment: price } },
        })
    })

    revalidatePath('/')
    revalidatePath('/stats')
}

export async function toggleJobStatus(jobId: number, field: unknown) {
    const { id: userId } = await requireRole('stringer')
    if (!Number.isSafeInteger(jobId) || jobId <= 0) throw new Error('Cordage invalide')
    if (!isJobStatusField(field)) throw new Error('Statut invalide')

    await prisma.$transaction(async (transaction) => {
        const job = await transaction.racketJob.findFirst({ where: { id: jobId, userId } })
        if (!job) throw new Error('Cordage introuvable')
        if (!canToggleJobStatus(job, field)) {
            if (field === 'isReturned') throw new Error('La raquette doit être faite avant d’être rendue')
            throw new Error('La raquette doit être marquée non rendue avant d’annuler sa réalisation')
        }

        await transaction.racketJob.update({
            where: { id: job.id },
            data: { [field]: !job[field] },
        })

        if (field === 'isPaid') {
            await transaction.customer.update({
                where: { id: job.customerId },
                data: {
                    balance: { increment: balanceAdjustmentForPaidToggle(job.price, job.isPaid) },
                },
            })
        }
    })

    revalidatePath('/')
    revalidatePath('/stats')
}

export async function deleteJob(jobId: number) {
    const { id: userId } = await requireRole('stringer')
    if (!Number.isSafeInteger(jobId) || jobId <= 0) throw new Error('Cordage invalide')

    await prisma.$transaction(async (transaction) => {
        const job = await transaction.racketJob.findFirst({ where: { id: jobId, userId } })
        if (!job) throw new Error('Cordage introuvable')

        if (!job.isPaid) {
            await transaction.customer.update({
                where: { id: job.customerId },
                data: { balance: { decrement: job.price } },
            })
        }

        await transaction.racketJob.delete({ where: { id: job.id } })
    })

    revalidatePath('/')
    revalidatePath('/stats')
}

export async function exportData() {
    const { id: userId } = await requireRole('stringer')

    const customers = await prisma.customer.findMany({
        where: { userId },
        include: {
            jobs: true
        }
    })
    return customers
}
