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
        <div className="mb-6 space-y-4 border border-line bg-surface p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">

                {/* Search Name */}
                <form onSubmit={handleSearch} className="relative w-full md:w-64">
                    <Input
                        aria-label="Rechercher un client"
                        placeholder="Rechercher un prénom..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                </form>

                {/* Sport Filters */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        aria-pressed={!currentSport}
                        variant={!currentSport ? "default" : "outline"}
                        size="sm"
                        onClick={() => router.push(pathname + '?' + createQueryString('sport', ''))}
                    >
                        Tous
                    </Button>
                    {['Tennis', 'Badminton', 'Squash'].map(sport => (
                        <Button
                            aria-pressed={currentSport === sport}
                            key={sport}
                            variant={currentSport === sport ? "default" : "outline"}
                            size="sm"
                            onClick={() => router.push(pathname + '?' + createQueryString('sport', sport))}
                        >
                            {sport}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                <span className="eyebrow mr-2 flex items-center">État</span>
                <Button
                    aria-pressed={!currentStatus}
                    variant={!currentStatus ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', ''))}
                >
                    Tout voir
                </Button>
                <Button
                    aria-pressed={currentStatus === 'active'}
                    variant={currentStatus === 'active' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'active'))}
                >
                    En cours
                </Button>
                <Button
                    aria-pressed={currentStatus === 'done'}
                    variant={currentStatus === 'done' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'done'))}
                >
                    Fait
                </Button>
                <Button
                    aria-pressed={currentStatus === 'paid'}
                    variant={currentStatus === 'paid' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'paid'))}
                >
                    Payé
                </Button>
                <Button
                    aria-pressed={currentStatus === 'returned'}
                    variant={currentStatus === 'returned' ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push(pathname + '?' + createQueryString('status', 'returned'))}
                >
                    Rendu
                </Button>
            </div>
        </div>
    )
}
