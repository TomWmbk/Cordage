import { db as prisma } from '@/lib/db'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Euro, History } from 'lucide-react'
import { JobFilters } from '@/components/job-filters'
import { JobRow } from '@/components/job-row'
import { pageStyles, kpiStyles } from '@/lib/styles'
import { ExportButton } from '@/components/export-button'
import { StatsDashboard } from '@/components/stats-dashboard'
import { Clock, Wallet } from 'lucide-react'
import { getCurrentUserId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function StatsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const search = typeof params.search === 'string' ? params.search : undefined
    const sport = typeof params.sport === 'string' ? params.sport : undefined
    const status = typeof params.status === 'string' ? params.status : undefined

    const userId = await getCurrentUserId()


    // --- History Logic ---
    // Helper function to normalize strings (remove accents and lowercase)
    function normalizeString(str: string): string {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .toLowerCase()
    }

    const where: any = { userId }  // Always filter by current user

    // Filter by Sport (can be done at DB level)
    if (sport) {
        where.customer = {
            sport: sport
        }
    }

    // Filter by Status
    if (status === 'active') {
        where.OR = [
            { isDone: false },
            { isPaid: false },
            { isReturned: false }
        ]
    } else if (status === 'done') {
        where.isDone = true
    } else if (status === 'paid') {
        where.isPaid = true
    } else if (status === 'returned') {
        where.isReturned = true
    }

    // Fetch ALL jobs for statistics - only for current user
    const allJobs = await prisma.racketJob.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })

    // Fetch jobs for history table (with filters)
    let historyJobs = await prisma.racketJob.findMany({
        where,
        include: {
            customer: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 100 // Fetch more to filter client-side
    })

    // Apply name search filter client-side (case and accent insensitive)
    if (search) {
        const normalizedSearch = normalizeString(search)
        historyJobs = historyJobs.filter(job =>
            normalizeString(job.customer.firstName).includes(normalizedSearch)
        )
    }

    // Limit to 50 results
    historyJobs = historyJobs.slice(0, 50)

    return (
        <div className={pageStyles.wrapper}>
            <Header />

            <main className={pageStyles.container}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-0">Statistiques</h1>
                    <ExportButton />
                </div>

                {/* Interactive Dashboard */}
                <section className="mb-12">
                    <StatsDashboard jobs={allJobs.map(job => ({
                        id: job.id,
                        createdAt: job.createdAt.toISOString(),
                        price: job.price,
                        cost: job.cost,
                        isPaid: job.isPaid,
                        isDone: job.isDone
                    }))} />
                </section>

                {/* History Table with Filters */}
                <section>
                    <div className={pageStyles.sectionHeader}>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Historique des Cordages</h2>
                        <span className={pageStyles.countBadge}>
                            {historyJobs.length}
                        </span>
                    </div>

                    <JobFilters />

                    <div className="space-y-4">
                        {historyJobs.length === 0 ? (
                            <div className={pageStyles.emptyState}>
                                Aucun cordage trouvé avec ces filtres.
                            </div>
                        ) : (
                            historyJobs.map((job: any) => (
                                <JobRow key={job.id} job={{
                                    ...job,
                                    createdAt: job.createdAt.toISOString(),
                                    customer: {
                                        firstName: job.customer.firstName,
                                        sport: job.customer.sport
                                    }
                                }} />
                            ))
                        )}
                    </div>
                </section>

            </main>
        </div>
    )
}
