'use client'

import { deleteJob } from '@/app/actions'
import { Trash2 } from 'lucide-react'

export function DeleteJobButton({ jobId }: { jobId: number }) {
    return (
        <button
            onClick={() => {
                if (confirm('Voulez-vous vraiment supprimer ce cordage ?')) {
                    deleteJob(jobId)
                }
            }}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-100"
            title="Supprimer"
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    )
}
