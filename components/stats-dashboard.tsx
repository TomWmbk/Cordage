'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Wallet, History, X, Calendar } from 'lucide-react'
import { kpiStyles } from '@/lib/styles'
import { cn } from '@/lib/utils'
import { Input } from '@/components/input'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { Button } from '@/components/button'

type Job = {
    id: number
    createdAt: Date | string
    price: number
    cost: number
    isPaid: boolean
    isDone: boolean
}

interface StatsDashboardProps {
    jobs: Job[]
}

type Metric = 'profit' | 'volume'

export function StatsDashboard({ jobs }: StatsDashboardProps) {
    const [activeModalMetric, setActiveModalMetric] = useState<Metric | null>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    // Default to last 6 months
    const [startDate, setStartDate] = useState(() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 6)
        return d.toISOString().split('T')[0]
    })
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])

    // Parse dates once
    const parsedJobs = useMemo(() => {
        return jobs.map(job => ({
            ...job,
            createdAt: new Date(job.createdAt)
        }))
    }, [jobs])

    // Global KPIs (All Time) for the main cards
    const globalKpis = useMemo(() => {
        let profit = 0
        let volume = 0
        parsedJobs.forEach(job => {
            if (job.isPaid) {
                profit += (job.price || 0) - (job.cost || 0)
            }
            if (job.isDone) {
                volume += 1
            }
        })
        return { profit, volume }
    }, [parsedJobs])

    // Filter data based on custom date range
    const filteredData = useMemo(() => {
        if (!activeModalMetric) return []

        const start = new Date(startDate)
        const end = new Date(endDate)
        // Set end date to end of day
        end.setHours(23, 59, 59, 999)

        return parsedJobs.filter(job =>
            job.createdAt >= start && job.createdAt <= end
        )
    }, [parsedJobs, startDate, endDate, activeModalMetric])

    // Prepare Chart Data
    const chartData = useMemo(() => {
        if (!activeModalMetric) return []

        const grouped = new Map<string, { date: string, value: number }>()

        filteredData.forEach(job => {
            // Group by Month
            const key = `${job.createdAt.getFullYear()}-${job.createdAt.getMonth()}`
            const dateLabel = job.createdAt.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })

            if (!grouped.has(key)) {
                grouped.set(key, { date: dateLabel, value: 0 })
            }

            const entry = grouped.get(key)!

            if (activeModalMetric === 'profit') {
                if (job.isPaid) {
                    entry.value += (job.price || 0) - (job.cost || 0)
                }
            } else {
                if (job.isDone) {
                    entry.value += 1
                }
            }
        })

        return Array.from(grouped.entries())
            .sort((a, b) => {
                const [yearA, monthA] = a[0].split('-').map(Number)
                const [yearB, monthB] = b[0].split('-').map(Number)
                return yearA !== yearB ? yearA - yearB : monthA - monthB
            })
            .map(entry => entry[1])
    }, [filteredData, activeModalMetric])

    useEffect(() => {
        if (!activeModalMetric) return
        closeButtonRef.current?.focus()
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setActiveModalMetric(null)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [activeModalMetric])

    return (
        <>
            {/* Main Page KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button type="button" className="w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-100" onClick={() => setActiveModalMetric('profit')}>
                    <Card className={cn(kpiStyles.card, "h-full transition-all hover:shadow-md") }>
                        <CardHeader className={kpiStyles.header}>
                            <CardTitle className={kpiStyles.title}>Bénéfice Total</CardTitle>
                            <Wallet className={kpiStyles.icon.emerald} aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                            <div className={kpiStyles.value}>{globalKpis.profit.toFixed(2)} €</div>
                            <p className={kpiStyles.subtext}>Afficher le détail</p>
                        </CardContent>
                    </Card>
                </button>

                <button type="button" className="w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-100" onClick={() => setActiveModalMetric('volume')}>
                    <Card className={cn(kpiStyles.card, "h-full transition-all hover:shadow-md") }>
                        <CardHeader className={kpiStyles.header}>
                            <CardTitle className={kpiStyles.title}>Volume Total</CardTitle>
                            <History className={kpiStyles.icon.orange} aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                            <div className={kpiStyles.value}>{globalKpis.volume}</div>
                            <p className={kpiStyles.subtext}>Raquettes cordées</p>
                        </CardContent>
                    </Card>
                </button>
            </div>

            {/* Modal */}
            {activeModalMetric && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setActiveModalMetric(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="stats-modal-title"
                        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <Button
                                variant="ghost"
                                size="icon"
                                ref={closeButtonRef}
                                onClick={() => setActiveModalMetric(null)}
                                className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                                aria-label="Fermer le détail"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            <h2 id="stats-modal-title" className="text-center text-lg font-semibold text-slate-900 dark:text-white">
                                {activeModalMetric === 'profit' ? 'Évolution du Bénéfice' : 'Évolution du Volume'}
                            </h2>
                            <div className="w-10"></div>
                        </div>

                        <div className="space-y-6 p-4 sm:p-6">
                            {/* Date Range Selector */}
                            <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                                {/* Quick Select Buttons */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {[
                                        { label: '1 Mois', months: 1 },
                                        { label: '6 Mois', months: 6 },
                                        { label: '1 An', months: 12 },
                                        { label: 'Tout', months: 0 }
                                    ].map((period) => (
                                        <Button
                                            key={period.label}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const end = new Date()
                                                const start = new Date()
                                                if (period.months === 0) {
                                                    start.setTime(0) // Beginning of time
                                                } else {
                                                    start.setMonth(start.getMonth() - period.months)
                                                }
                                                setStartDate(start.toISOString().split('T')[0])
                                                setEndDate(end.toISOString().split('T')[0])
                                            }}
                                            className="bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            {period.label}
                                        </Button>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        <label htmlFor="stats-start-date" className="text-sm font-medium text-slate-700 dark:text-slate-300">Du</label>
                                        <Input
                                            id="stats-start-date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-auto dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:[color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="stats-end-date" className="text-sm font-medium text-slate-700 dark:text-slate-300">Au</label>
                                        <Input
                                            id="stats-end-date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-auto dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-72 w-full sm:h-[400px]" aria-label="Graphique des statistiques">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                    minWidth={0}
                                    minHeight={0}
                                    initialDimension={{ width: 320, height: 288 }}
                                >
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-700" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickFormatter={(value) => activeModalMetric === 'profit' ? `${value}€` : value}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--tooltip-bg, #fff)',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                color: '#1e293b'
                                            }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill={activeModalMetric === 'profit' ? '#10b981' : '#f97316'}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
