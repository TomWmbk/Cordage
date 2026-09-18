'use client'

import { useState, useEffect, useRef } from 'react'
import { createJob, getCustomers } from '@/app/actions'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Search, Percent, X } from 'lucide-react'

export function NewJobForm({ stringReferences = [] }: { stringReferences?: any[] }) {
    const [firstName, setFirstName] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Form states
    const [sport, setSport] = useState('')
    const [tension, setTension] = useState('')
    const [price, setPrice] = useState('')
    const [selectedStringId, setSelectedStringId] = useState('')

    // Credit logic
    const [showCredit, setShowCredit] = useState(false)
    const [creditAmount, setCreditAmount] = useState('')

    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (firstName.length < 1) {
                setSuggestions([])
                return
            }
            const results = await getCustomers(firstName)
            setSuggestions(results)
        }

        const timeoutId = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeoutId)
    }, [firstName])

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
        setFirstName(customer.firstName)
        setSport(customer.sport)
        setTension(customer.defaultTension || '')
        if (customer.lastPrice) {
            setPrice(customer.lastPrice.toString())
        }
        setShowSuggestions(false)
    }

    const handleStringChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stringId = e.target.value
        setSelectedStringId(stringId)

        const selectedString = stringReferences.find(s => s.id.toString() === stringId)
        if (selectedString) {
            setPrice(selectedString.price.toString())
        } else {
            setPrice('')
        }
    }

    const handleSubmit = async (formData: FormData) => {
        const originalPrice = parseFloat(formData.get('price') as string)

        // Store the original price (before credit) to update the customer's default price
        if (!isNaN(originalPrice)) {
            formData.set('standardPrice', originalPrice.toString())
        }

        if (showCredit && creditAmount) {
            const credit = parseFloat(creditAmount)
            if (!isNaN(originalPrice) && !isNaN(credit)) {
                const finalPrice = Math.max(0, originalPrice - credit)
                formData.set('price', finalPrice.toString())
            }
        }

        // Add string name if selected
        const selectedString = stringReferences.find(s => s.id.toString() === selectedStringId)
        if (selectedString) {
            formData.set('stringName', `${selectedString.brand} ${selectedString.model} ${selectedString.gauge || ''}`)
        }

        await createJob(formData)

        // Reset Form
        setFirstName('')
        setSport('')
        setTension('')
        setPrice('')
        setSelectedStringId('')
        setShowCredit(false)
        setCreditAmount('')
    }

    return (
        <Card className="mb-8 border-slate-200 shadow-sm dark:border-slate-700">
            <CardHeader className="bg-slate-50/50 pb-4 dark:bg-slate-900/50 dark:border-b dark:border-slate-800">
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2 dark:text-white">
                    Nouveau Cordage
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                    {/* Name Input with Autocomplete */}
                    <div className="md:col-span-3 relative" ref={wrapperRef}>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Prénom</label>
                        <div className="relative">
                            <Input
                                name="firstName"
                                placeholder="Prénom..."
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                    setShowSuggestions(true)
                                }}
                                autoComplete="off"
                                className="pl-9 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                                required
                            />
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto dark:bg-slate-800 dark:border-slate-700">
                                {suggestions.map((c) => (
                                    <div
                                        key={c.id}
                                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                                        onClick={() => selectCustomer(c)}
                                    >
                                        <span className="font-medium">{c.firstName}</span>
                                        <span className="text-xs text-slate-400 ml-2">({c.sport})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sport */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Sport</label>
                        <select
                            name="sport"
                            value={sport}
                            onChange={(e) => setSport(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:ring-offset-slate-950 dark:placeholder:text-slate-400"
                        >
                            <option value="" disabled>Choisir...</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Badminton">Badminton</option>
                            <option value="Squash">Squash</option>
                        </select>
                    </div>

                    {/* String Selection */}
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Cordage</label>
                        <select
                            name="stringId"
                            value={selectedStringId}
                            onChange={handleStringChange}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:ring-offset-slate-950 dark:placeholder:text-slate-400"
                        >
                            <option value="">Sélectionner...</option>
                            {stringReferences.map((str) => (
                                <option key={str.id} value={str.id}>
                                    {str.brand} {str.model} {str.gauge}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tension */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Tension</label>
                        <Input
                            name="tension"
                            type="number"
                            step="0.1"
                            placeholder="24"
                            value={tension}
                            onChange={(e) => setTension(e.target.value)}
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                            required
                        />
                    </div>

                    {/* Price & Credit */}
                    {/* Price & Credit */}
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Prix</label>
                        <div className="flex items-center gap-2">
                            <div className="relative w-32">
                                <Input
                                    name="price"
                                    type="number"
                                    step="0.5"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 pr-6"
                                    placeholder="25"
                                    required
                                />
                                <span className="absolute right-2 top-2.5 text-slate-400 text-sm">€</span>
                            </div>

                            {showCredit ? (
                                <div className="flex items-center gap-1 animate-in slide-in-from-left-2 duration-200">
                                    <div className="relative w-20">
                                        <Input
                                            type="number"
                                            step="0.5"
                                            placeholder="Rem."
                                            value={creditAmount}
                                            onChange={(e) => setCreditAmount(e.target.value)}
                                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-white px-2 text-sm"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setShowCredit(false)
                                            setCreditAmount('')
                                        }}
                                        className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowCredit(true)}
                                    className="h-10 w-10 text-slate-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400"
                                    title="Ajouter une remise"
                                >
                                    <Percent className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-12 mt-2">
                        <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">
                            Ajouter
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
