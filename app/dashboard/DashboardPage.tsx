import { db as prisma } from '@/lib/db'
import { Header } from '@/components/header'
import { NewJobForm, type EditableJob } from '@/components/new-job-form'
import { JobRow } from '@/components/job-row'
import { pageStyles } from '@/lib/styles'
import { requireRole } from '@/lib/auth'
import { PageIntro } from '@/components/page-intro'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ edit?: string | string[] }>
}) {
    const { id: userId, laborPrice } = await requireRole('stringer')
    const editId = Number((await searchParams).edit)

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

    const jobToEdit = Number.isSafeInteger(editId) && editId > 0
        ? await prisma.racketJob.findFirst({ where: { id: editId, userId }, include: { customer: true } })
        : null
    const editingJob = jobToEdit ? toEditableJob(jobToEdit, stringReferences, laborPrice) : undefined

    return (
        <div className={pageStyles.wrapper}>
            <Header />

            <main className={pageStyles.container}>
                <PageIntro
                    eyebrow="File active"
                    title="Plan de travail"
                    description="Ajoutez une raquette, puis faites-la avancer jusqu’au retour client."
                />

                {/* New Job Section */}
                <section className="motion-enter-delayed mb-14">
                    <NewJobForm key={editingJob?.id ?? 'new'} stringReferences={stringReferences} laborPrice={laborPrice} editingJob={editingJob} />
                </section>

                {/* Active Jobs Section */}
                <section>
                    <div className={pageStyles.sectionHeader}>
                        <h2 className={pageStyles.sectionTitle}>Raquettes en cours</h2>
                        <span className={pageStyles.countBadge}>
                            {activeJobs.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {activeJobs.length === 0 ? (
                            <div className={pageStyles.emptyState}>
                                <p className="font-display text-2xl font-bold uppercase text-ink dark:text-white">Plan de travail dégagé</p>
                                <p className="mt-2">La prochaine raquette apparaîtra ici.</p>
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

function toEditableJob(
    job: { id: number; tension: string; price: number; stringName: string | null; stringSource: string; customer: { firstName: string; sport: string } },
    stringReferences: { id: number; brand: string; model: string; gauge: string | null; price: number }[],
    laborPrice: number,
): EditableJob {
    const stringSource = job.stringSource === 'player' ? 'player' : 'shop'
    // Le job ne garde que le nom du cordage : on retrouve la référence par son nom
    const reference = stringSource === 'shop'
        ? stringReferences.find((r) => [r.brand, r.model, r.gauge].filter(Boolean).join(' ') === job.stringName)
        : undefined
    const canDeriveDiscount = stringSource === 'player' || reference !== undefined
    const standardPrice = laborPrice + (reference?.price ?? 0)

    return {
        id: job.id,
        firstName: job.customer.firstName,
        sport: job.customer.sport,
        tension: job.tension,
        stringSource,
        stringId: reference?.id ?? null,
        playerStringName: stringSource === 'player' && job.stringName !== 'Bobine du joueur' ? job.stringName : null,
        discount: canDeriveDiscount ? Math.max(0, Math.round((standardPrice - job.price) * 100) / 100) : 0,
    }
}
