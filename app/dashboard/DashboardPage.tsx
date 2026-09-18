import { db as prisma } from '@/lib/db'
import { Header } from '@/components/header'
import { NewJobForm } from '@/components/new-job-form'
import { JobRow } from '@/components/job-row'
import { pageStyles } from '@/lib/styles'
import { requireRole } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const { id: userId } = await requireRole('stringer')

    // Fetch active jobs (not fully complete) - only for current user
    const activeJobs = await prisma.racketJob.findMany({
        where: {
            userId,
            OR: [
                { isDone: false },
                { isPaid: false },
                { isReturned: false }
            ]
        },
        include: {
            customer: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Fetch string references for the form
    const stringReferences = await prisma.stringReference.findMany({
        where: { userId, isInStock: true },
        orderBy: { brand: 'asc' },
        select: {
            id: true,
            brand: true,
            model: true,
            gauge: true,
            price: true,
        },
    })

    return (
        <div className={pageStyles.wrapper}>
            <Header />

            <main className={pageStyles.container}>
                <h1 className="sr-only">Tableau de bord des cordages</h1>

                {/* New Job Section */}
                <section className="mb-12">
                    <NewJobForm stringReferences={stringReferences} />
                </section>

                {/* Active Jobs Section */}
                <section>
                    <div className={pageStyles.sectionHeader}>
                        <h2 className={pageStyles.sectionTitle}>En Cours</h2>
                        <span className={pageStyles.countBadge}>
                            {activeJobs.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {activeJobs.length === 0 ? (
                            <div className={pageStyles.emptyState}>
                                Aucun cordage en cours. Profitez-en pour vous reposer !
                            </div>
                        ) : (
                            activeJobs.map((job) => (
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
