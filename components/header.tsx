import Link from 'next/link'
import { Activity } from 'lucide-react'

export function Header() {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Gestion de cordage</span>
                </div>

                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/stats" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Stats
                    </Link>
                </nav>
            </div>
        </header>
    )
}
