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
        <article aria-busy={isPending} className="group relative flex flex-col justify-between gap-4 overflow-hidden border border-line bg-surface p-4 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--foreground)_7%,transparent)] md:flex-row md:items-center dark:hover:border-acid/50">

            {/* Left: Info */}
            <div className="flex w-full min-w-0 items-start gap-3 md:w-auto md:items-center md:gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center border border-ink bg-ink text-white dark:border-acid dark:bg-acid dark:text-acid-ink">
                    <span className="font-display text-xl font-bold leading-none tabular-nums">{progress}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">avancée</span>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink dark:text-white">
                            {job.customer.firstName}
                        </h3>
                        <DeleteJobButton jobId={job.id} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        <span className="font-bold uppercase tracking-wide text-ink dark:text-stone-200">{job.customer.sport}</span>
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
                    <div className="mt-3 flex max-w-40 gap-1" aria-hidden="true">
                        {steps.map((complete, index) => <span key={index} className={cn('h-1 flex-1 transition-colors duration-300', complete ? 'bg-acid' : 'bg-ink/10 dark:bg-white/10')} />)}
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
                        "min-w-0 gap-1.5 px-2 md:px-3",
                        job.isDone
                            ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
                            : "text-muted hover:text-ink dark:hover:text-white"
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
                        "min-w-0 gap-1.5 px-2 md:px-3",
                        job.isPaid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-300"
                            : "text-muted hover:text-ink dark:hover:text-white"
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
                        "min-w-0 gap-1.5 px-2 md:px-3",
                        job.isReturned
                            ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/50 dark:hover:text-orange-300"
                            : "text-muted hover:text-ink dark:hover:text-white"
                    )}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rendu</span>
                </Button>

            </div>
        </article>
    )
}
