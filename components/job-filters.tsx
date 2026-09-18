'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Search } from 'lucide-react'
import { useCallback, useState } from 'react'

export function JobFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    const [search, setSearch] = useState(searchParams.get('search') || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.push(pathname + '?' + createQueryString('search', search))
    }

    const currentSport = searchParams.get('sport')
    const currentStatus = searchParams.get('status')

    return (
        <div className="space-y-4 mb-6 bg-white p-4 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">

                {/* Search Name */}
                <form onSubmit={handleSearch} className="relative w-full md:w-64">
                    <Input
                        placeholder="Rechercher un prénom..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                </form>

                {/* Sport Filters */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={!currentSport ? "default" : "outline"}
                        size="sm"
                        onClick={() => router.push(pathname + '?' + createQueryString('sport', ''))}
                        className={!currentSport ? "dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600" : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                    >
                        Tous
                    </Button>
                    {['Tennis', 'Badminton', 'Squash'].map(sport => (
                        <Button
                            key={sport}
                            variant={currentSport === sport ? "default" : "outline"}
                            size="sm"
                            onClick={() => router.push(pathname + '?' + createQueryString('sport', sport))}
                            className={currentSport === sport
                                ? "dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500"
                                : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                        >
                            {sport}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap border-t border-slate-100 pt-4 dark:border-slate-700">
                <span className="text-sm text-slate-500 flex items-center mr-2 dark:text-slate-400">Etat:</span>
                <Button
                    variant={!currentStatus ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', ''))}
                    className={!currentStatus ? "dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600" : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                >
                    Tout voir
                </Button>
                <Button
                    variant={currentStatus === 'active' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'active'))}
                    className={currentStatus === 'active' ? "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500" : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                >
                    En cours
                </Button>
                <Button
                    variant={currentStatus === 'done' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'done'))}
                    className={currentStatus === 'done' ? "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500" : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                >
                    Fait
                </Button>
                <Button
                    variant={currentStatus === 'paid' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'paid'))}
                    className={currentStatus === 'paid' ? "dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500" : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                >
                    Payé
                </Button>
                <Button
                    variant={currentStatus === 'returned' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'returned'))}
                    className={currentStatus === 'returned' ? "dark:bg-orange-600 dark:text-white dark:hover:bg-orange-500" : "dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}
                >
                    Rendu
                </Button>
            </div>
        </div>
    )
}
