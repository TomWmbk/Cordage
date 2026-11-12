'use client'

import { Button } from '@/components/button'
import { Download } from 'lucide-react'
import { exportData } from '@/app/actions'
import { jobsCsv } from '@/lib/csv'
import { useState } from 'react'

export function ExportButton() {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState('')
    const handleExport = async () => {
        setPending(true)
        setError('')
        try {
        const data = await exportData()
        const blob = new Blob([jobsCsv(data)], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cordage-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch {
            setError('Export impossible. Réessayez.')
        } finally { setPending(false) }
    }

    return (
        <div><Button variant="outline" disabled={pending} onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            {pending ? 'Export…' : 'Export CSV'}
        </Button>
        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}</div>
    )
}
