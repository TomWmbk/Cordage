'use client'

import { toggleJobStatus } from '@/app/actions'
import { Button } from '@/components/button'
import { Hammer, Euro, CheckCircle2, Clock } from 'lucide-react'
import { DeleteJobButton } from '@/components/delete-job-button'
import { cn } from "../lib/utils"
import { useTransition } from 'react'

interface JobRowProps {
    job: {
        id: number
        customer: {
            firstName: string
            sport: string
        }
        tension: number
        price: number
        createdAt: Date | string
        isDone: boolean
        isPaid: boolean
        isReturned: boolean
    }
}

export function JobRow({ job }: JobRowProps) {
    const [isPending, startTransition] = useTransition()
    // Calculate progress
    const steps = [job.isDone, job.isPaid, job.isReturned]
    const completedSteps = steps.filter(Boolean).length
    const progress = Math.round((completedSteps / 3) * 100)

    const toggle = (field: 'isDone' | 'isPaid' | 'isReturned') => {
        startTransition(() => toggleJobStatus(job.id, field))
    }

    return (
        <article aria-busy={isPending} className="group flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">

            {/* Left: Info */}
            <div className="flex w-full min-w-0 items-start gap-3 md:w-auto md:items-center md:gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                    progress === 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border dark:border-emerald-800" :
                        progress >= 66 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400 dark:border dark:border-orange-800" :
                            progress >= 33 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 dark:border dark:border-blue-800" :
                                "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400 dark:border dark:border-slate-600"
                )}>
                    {progress}%
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            {job.customer.firstName}
                        </h3>
                        <DeleteJobButton jobId={job.id} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{job.customer.sport}</span>
                        <span>•</span>
                        <span>{job.tension} kg</span>
                        <span>•</span>
                        <span>{job.price} €</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {(() => {
                                const d = new Date(job.createdAt)
                                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
                            })()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="grid w-full grid-cols-3 gap-2 md:flex md:w-auto md:justify-end">

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggle('isDone')}
                    disabled={isPending}
                    aria-label={job.isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                    aria-pressed={job.isDone}
                    className={cn(
                        "min-w-0 gap-1.5 px-2 transition-colors md:px-3 dark:border-slate-700 dark:bg-slate-900/50",
                        job.isDone
                            ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
                            : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 dark:hover:border-slate-600"
                    )}
                >
                    <Hammer className="w-4 h-4" />
                    <span>Fait</span>
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggle('isPaid')}
                    disabled={isPending}
                    aria-label={job.isPaid ? 'Marquer comme non payé' : 'Marquer comme payé'}
                    aria-pressed={job.isPaid}
                    className={cn(
                        "min-w-0 gap-1.5 px-2 transition-colors md:px-3 dark:border-slate-700 dark:bg-slate-900/50",
                        job.isPaid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-300"
                            : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 dark:hover:border-slate-600"
                    )}
                >
                    <Euro className="w-4 h-4" />
                    <span>Payé</span>
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggle('isReturned')}
                    disabled={isPending}
                    aria-label={job.isReturned ? 'Marquer comme non rendu' : 'Marquer comme rendu'}
                    aria-pressed={job.isReturned}
                    className={cn(
                        "min-w-0 gap-1.5 px-2 transition-colors md:px-3 dark:border-slate-700 dark:bg-slate-900/50",
                        job.isReturned
                            ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/50 dark:hover:text-orange-300"
                            : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 dark:hover:border-slate-600"
                    )}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rendu</span>
                </Button>

            </div>
        </article>
    )
}
