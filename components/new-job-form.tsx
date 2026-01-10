'use client'

import { useState, useEffect, useRef } from 'react'
import { createJob, getCustomers } from '@/app/actions'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Search, Plus } from 'lucide-react'

export function NewJobForm() {
    const [nameQuery, setNameQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Form states to pre-fill
    const [sport, setSport] = useState('')
    const [tension, setTension] = useState('')
    const [price, setPrice] = useState('20') // Default price

    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (nameQuery.length < 1) {
                setSuggestions([])
                return
            }
            const results = await getCustomers(nameQuery)
            setSuggestions(results)
        }

        const timeoutId = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeoutId)
    }, [nameQuery])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapperRef])

    const selectCustomer = (customer: any) => {
        setNameQuery(customer.firstName + (customer.lastName ? ' ' + customer.lastName : ''))
        setSport(customer.sport)
        setTension(customer.defaultTension || '')
        setShowSuggestions(false)
    }

    return (
        <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    Nouveau Cordage
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={createJob} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                    {/* Name Input with Autocomplete */}
                    <div className="md:col-span-4 relative" ref={wrapperRef}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Joueur</label>
                        <div className="relative">
                            <Input
                                name="customerName"
                                placeholder="Nom du joueur..."
                                value={nameQuery}
                                onChange={(e) => {
                                    setNameQuery(e.target.value)
                                    setShowSuggestions(true)
                                }}
                                autoComplete="off"
                                className="pl-9"
                                required
                            />
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                {suggestions.map((c) => (
                                    <div
                                        key={c.id}
                                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                                        onClick={() => selectCustomer(c)}
                                    >
                                        <span className="font-medium">{c.firstName} {c.lastName}</span>
                                        <span className="text-xs text-slate-400 ml-2">({c.sport})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sport */}
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sport</label>
                        <Input
                            name="sport"
                            placeholder="Tennis, Squash..."
                            value={sport}
                            onChange={(e) => setSport(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tension */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tension (kg)</label>
                        <Input
                            name="tension"
                            type="number"
                            step="0.1"
                            placeholder="24"
                            value={tension}
                            onChange={(e) => setTension(e.target.value)}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prix</label>
                        <Input
                            name="price"
                            type="number"
                            step="0.5"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                            Ajouter
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
