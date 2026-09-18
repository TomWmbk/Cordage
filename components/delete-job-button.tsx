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
            className="p-1 text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
            title="Supprimer"
            aria-label="Supprimer ce cordage"
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    )
}
