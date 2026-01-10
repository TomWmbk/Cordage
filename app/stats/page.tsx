import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Euro, TrendingUp, History } from 'lucide-react'
import { DeleteJobButton } from '@/components/delete-job-button'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
    const now = new Date()
    const oneMonthAgo = new Date(new Date().setMonth(now.getMonth() - 1))
    const threeMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 3))
    const sixMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 6))

    // KPI: Total Revenue (Paid jobs)
    const revenueAgg = await prisma.racketJob.aggregate({
        _sum: { price: true },
        where: { isPaid: true }
    })
    const totalRevenue = revenueAgg._sum.price || 0

    // KPI: Counts
    // KPI: Counts (Only completed jobs)
    const count1Month = await prisma.racketJob.count({
        where: {
            createdAt: { gte: oneMonthAgo },
            isDone: true
        }
    })
    const count3Months = await prisma.racketJob.count({
        where: {
            createdAt: { gte: threeMonthsAgo },
            isDone: true
        }
    })
    const count6Months = await prisma.racketJob.count({
        where: {
            createdAt: { gte: sixMonthsAgo },
            isDone: true
        }
    })

    // History: Completed Jobs
    const historyJobs = await prisma.racketJob.findMany({
        where: {
            isDone: true,
            isPaid: true,
            isReturned: true
        },
        include: {
            customer: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50 // Limit to last 50 for performance
    })

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Statistiques</h1>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Chiffre d'Affaires Total
                            </CardTitle>
                            <Euro className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
                            <p className="text-xs text-slate-500">
                                Sur les raquettes payées
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Volume (1 mois)
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count1Month}</div>
                            <p className="text-xs text-slate-500">
                                Raquettes cordées
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Volume (6 mois)
                            </CardTitle>
                            <History className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count6Months}</div>
                            <p className="text-xs text-slate-500">
                                Raquettes cordées
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* History Table */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Historique (Terminées)</h2>
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Sport</th>
                                    <th className="px-6 py-3">Tension</th>
                                    <th className="px-6 py-3 text-right">Prix</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {historyJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            Aucune raquette archivée pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    historyJobs.map((job: any) => (
                                        <tr key={job.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-3 text-slate-600">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-2">
                                                {job.customer.firstName} {job.customer.lastName}
                                                <DeleteJobButton jobId={job.id} />
                                            </td>
                                            <td className="px-6 py-3 text-slate-600">
                                                {job.customer.sport}
                                            </td>
                                            <td className="px-6 py-3 text-slate-600">
                                                {job.tension} kg
                                            </td>
                                            <td className="px-6 py-3 text-right font-medium text-emerald-700">
                                                {job.price.toFixed(2)} €
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>
        </div>
    )
}
