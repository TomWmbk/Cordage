'use client'

import { toggleJobStatus } from '@/app/actions'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Hammer, Euro, CheckCircle2, Clock } from 'lucide-react'
import { DeleteJobButton } from '@/components/delete-job-button'
import { cn } from "../lib/utils"

interface JobRowProps {
    job: {
        id: number
        customer: {
            firstName: string
            lastName: string | null
            sport: string
        }
        tension: number
        price: number
        createdAt: Date
        isDone: boolean
        isPaid: boolean
        isReturned: boolean
    }
}

export function JobRow({ job }: JobRowProps) {
    // Calculate progress
    const steps = [job.isDone, job.isPaid, job.isReturned]
    const completedSteps = steps.filter(Boolean).length
    const progress = Math.round((completedSteps / 3) * 100)

    // Status color logic
    const isFullyComplete = completedSteps === 3

    return (
        <div className="group flex flex-col md:flex-row items-center justify-between p-4 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all mb-3">

            {/* Left: Info */}
            <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold",
                    isFullyComplete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                )}>
                    {progress}%
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">
                            {job.customer.firstName} {job.customer.lastName}
                        </h4>
                        <DeleteJobButton jobId={job.id} />
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{job.customer.sport}</span>
                        <span>•</span>
                        <span>{job.tension} kg</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleJobStatus(job.id, 'isDone')}
                    className={cn(
                        "flex-1 md:flex-none gap-2 transition-colors",
                        job.isDone
                            ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <Hammer className="w-4 h-4" />
                    <span className="hidden sm:inline">Fait</span>
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleJobStatus(job.id, 'isPaid')}
                    className={cn(
                        "flex-1 md:flex-none gap-2 transition-colors",
                        job.isPaid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <Euro className="w-4 h-4" />
                    <span className="hidden sm:inline">Payé</span>
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleJobStatus(job.id, 'isReturned')}
                    className={cn(
                        "flex-1 md:flex-none gap-2 transition-colors",
                        job.isReturned
                            ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Rendu</span>
                </Button>

            </div>
        </div>
    )
}
