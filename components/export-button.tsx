'use client'

import { Button } from '@/components/button'
import { Download } from 'lucide-react'
import { exportData } from '@/app/actions'

export function ExportButton() {
    const handleExport = async () => {
        const data = await exportData()
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cordage-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export JSON
        </Button>
    )
}
