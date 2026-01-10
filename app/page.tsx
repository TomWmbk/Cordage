import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { NewJobForm } from '@/components/new-job-form'
import { JobRow } from '@/components/job-row'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Fetch active jobs (not fully complete)
  const activeJobs = await prisma.racketJob.findMany({
    where: {
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">

        {/* New Job Section */}
        <section className="mb-12">
          <NewJobForm />
        </section>

        {/* Active Jobs Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">En Cours</h2>
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
              {activeJobs.length}
            </span>
          </div>

          <div className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 text-slate-500">
                Aucun cordage en cours. Profitez-en pour vous reposer !
              </div>
            ) : (
              activeJobs.map((job: any) => (
                <JobRow key={job.id} job={job} />
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
