'use client'

import { useState, useEffect, useRef } from 'react'
import { createJob, getCustomers } from '@/app/actions'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Search, Percent, X, Crosshair, Plus, PackageCheck, UserRound } from 'lucide-react'

type StringReference = {
    id: number
    brand: string
    model: string
    gauge: string | null
    price: number
}

type CustomerSuggestion = {
    id: number
    firstName: string
    sport: string
    defaultTension: string | null
}

export function NewJobForm({
    stringReferences = [],
    laborPrice,
}: {
    stringReferences?: StringReference[]
    laborPrice: number
}) {
    const [firstName, setFirstName] = useState('')
    const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Form states
    const [sport, setSport] = useState('')
    const [tension, setTension] = useState('')
    const [selectedStringId, setSelectedStringId] = useState('')
    const [stringSource, setStringSource] = useState<'shop' | 'player'>('shop')

    // Credit logic
    const [showCredit, setShowCredit] = useState(false)
    const [creditAmount, setCreditAmount] = useState('')

    const wrapperRef = useRef<HTMLDivElement>(null)
    const selectedString = stringReferences.find((reference) => reference.id.toString() === selectedStringId)
    const stringPrice = stringSource === 'shop' ? selectedString?.price ?? 0 : 0
    const standardPrice = Math.round((laborPrice + stringPrice) * 100) / 100
    const parsedCredit = Number(creditAmount)
    const appliedCredit = showCredit && Number.isFinite(parsedCredit) ? Math.max(0, parsedCredit) : 0
    const finalPrice = Math.max(0, Math.round((standardPrice - appliedCredit) * 100) / 100)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (firstName.length < 1) {
                setSuggestions([])
                return
            }
            try {
                const results = await getCustomers(firstName)
                setSuggestions(results)
            } catch {
                setSuggestions([])
            }
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

    const selectCustomer = (customer: CustomerSuggestion) => {
        setFirstName(customer.firstName)
        setSport(customer.sport)
        setTension(customer.defaultTension || '')
        setShowSuggestions(false)
    }

    const handleStringChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stringId = e.target.value
        setSelectedStringId(stringId)
    }

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setSubmitting(true)

        try {
            await createJob(formData)
            setFirstName('')
            setSport('')
            setTension('')
            setSelectedStringId('')
            setStringSource('shop')
            setShowCredit(false)
            setCreditAmount('')
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’ajouter ce cordage')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card className="sport-panel mb-8">
            <CardHeader className="border-b border-line bg-ink px-5 py-4 text-white dark:bg-surface-strong">
                <CardTitle as="h2" className="flex items-center justify-between gap-3 font-display text-2xl font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-2"><Crosshair className="h-5 w-5 text-acid" /> Nouvelle pose</span>
                    <span className="hidden text-xs font-semibold tracking-[.16em] text-stone-400 sm:inline">Entrée atelier</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
                <form action={handleSubmit} className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">

                    <fieldset className="md:col-span-12">
                        <legend className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Provenance du cordage</legend>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="stringSource"
                                    value="shop"
                                    checked={stringSource === 'shop'}
                                    onChange={() => {
                                        setStringSource('shop')
                                        setShowCredit(false)
                                        setCreditAmount('')
                                    }}
                                    className="peer sr-only"
                                />
                                <span className="flex min-h-16 items-center gap-3 border border-line bg-surface-strong px-4 py-3 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-acid dark:peer-checked:border-acid dark:peer-checked:bg-acid dark:peer-checked:text-acid-ink">
                                    <PackageCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    <span><strong className="block">Bobine de l’atelier</strong><span className="text-xs opacity-70">Pose + prix du cordage</span></span>
                                </span>
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="stringSource"
                                    value="player"
                                    checked={stringSource === 'player'}
                                    onChange={() => {
                                        setStringSource('player')
                                        setSelectedStringId('')
                                        setShowCredit(false)
                                        setCreditAmount('')
                                    }}
                                    className="peer sr-only"
                                />
                                <span className="flex min-h-16 items-center gap-3 border border-line bg-surface-strong px-4 py-3 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-acid dark:peer-checked:border-acid dark:peer-checked:bg-acid dark:peer-checked:text-acid-ink">
                                    <UserRound className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    <span><strong className="block">Bobine du joueur</strong><span className="text-xs opacity-70">Pose uniquement</span></span>
                                </span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Name Input with Autocomplete */}
                    <div className="md:col-span-3 relative" ref={wrapperRef}>
                        <label htmlFor="job-first-name" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Client</label>
                        <div className="relative">
                            <Input
                                name="firstName"
                                id="job-first-name"
                                placeholder="Prénom..."
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                    setShowSuggestions(true)
                                }}
                                autoComplete="off"
                                className="pl-9"
                                required
                            />
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <div role="listbox" aria-label="Clients suggérés" className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm border border-line bg-surface-strong shadow-xl">
                                {suggestions.map((c) => (
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected="false"
                                        key={c.id}
                                        className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-ink hover:bg-acid/20 dark:text-white"
                                        onClick={() => selectCustomer(c)}
                                    >
                                        <span className="font-medium">{c.firstName}</span>
                                        <span className="ml-2 text-xs text-muted">({c.sport})</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sport */}
                    <div className="md:col-span-2">
                        <label htmlFor="job-sport" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Sport</label>
                        <select
                            name="sport"
                            id="job-sport"
                            value={sport}
                            onChange={(e) => setSport(e.target.value)}
                            required
                            className="flex h-11 w-full rounded-sm border border-line bg-surface-strong px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid dark:text-white"
                        >
                            <option value="" disabled>Choisir...</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Badminton">Badminton</option>
                            <option value="Squash">Squash</option>
                        </select>
                    </div>

                    {/* String Selection */}
                    <div className="md:col-span-3">
                        {stringSource === 'shop' ? (
                            <>
                                <label htmlFor="job-string" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Cordage atelier</label>
                                <select
                                    name="stringId"
                                    id="job-string"
                                    value={selectedStringId}
                                    onChange={handleStringChange}
                                    required
                                    className="flex h-11 w-full rounded-sm border border-line bg-surface-strong px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid dark:text-white"
                                >
                                    <option value="">Sélectionner...</option>
                                    {stringReferences.map((str) => (
                                        <option key={str.id} value={str.id}>
                                            {str.brand} {str.model} {str.gauge}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <label htmlFor="player-string-name" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Cordage du joueur</label>
                                <Input
                                    name="playerStringName"
                                    id="player-string-name"
                                    maxLength={120}
                                    placeholder="Marque / modèle (facultatif)"
                                />
                            </>
                        )}
                    </div>

                    {/* Tension */}
                    <div className="md:col-span-1">
                        <label htmlFor="job-tension" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Tension</label>
                        <Input
                            name="tension"
                            id="job-tension"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="50"
                            placeholder="24"
                            value={tension}
                            onChange={(e) => setTension(e.target.value)}
                            className="font-display text-lg font-semibold tabular-nums"
                            required
                        />
                    </div>

                    {/* Price & Credit */}
                    <div className="md:col-span-3">
                        <label htmlFor="job-price" className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">Total calculé</label>
                        <div className="flex items-center gap-2">
                            <div className="relative w-32">
                                <Input
                                    id="job-price"
                                    type="number"
                                    value={finalPrice.toFixed(2)}
                                    readOnly
                                    aria-describedby="job-price-breakdown"
                                    className="pr-6 font-display text-lg font-semibold tabular-nums"
                                />
                                <span className="absolute right-2 top-3 text-sm text-muted">€</span>
                            </div>

                            {showCredit ? (
                                <div className="flex items-center gap-1 animate-in slide-in-from-left-2 duration-200">
                                    <div className="relative w-20">
                                        <Input
                                            name="discount"
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max={standardPrice}
                                            aria-label="Montant de la remise"
                                            placeholder="Rem."
                                            value={creditAmount}
                                            onChange={(e) => setCreditAmount(e.target.value)}
                                            className="px-2 text-sm"
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
                                        className="h-8 w-8 text-muted hover:text-ink dark:hover:text-white"
                                        aria-label="Supprimer la remise"
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
                                        className="h-11 w-11 text-muted hover:text-ink dark:hover:text-acid"
                                    title="Ajouter une remise"
                                >
                                    <Percent className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <p id="job-price-breakdown" className="mt-2 text-xs text-muted">
                            Pose {laborPrice.toFixed(2)} €{stringSource === 'shop' ? ` + cordage ${stringPrice.toFixed(2)} €` : ''}
                            {appliedCredit > 0 ? ` − remise ${appliedCredit.toFixed(2)} €` : ''}
                        </p>
                    </div>

                    {error && (
                        <div role="alert" className="md:col-span-12 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="md:col-span-12 mt-2">
                        <Button type="submit" disabled={submitting} size="lg" className="w-full gap-2">
                            <Plus className="h-4 w-4" />
                            {submitting ? 'Mise en file…' : 'Ajouter au plan de travail'}
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
