'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createJob, getCustomers, updateJob } from '@/app/actions'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Search, X, Crosshair, Plus, PackageCheck, UserRound, Pencil, Save } from 'lucide-react'

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

export type EditableJob = {
    id: number
    firstName: string
    sport: string
    tension: string
    stringSource: 'shop' | 'player'
    stringId: number | null
    playerStringName: string | null
    discount: number
}

export function NewJobForm({
    stringReferences = [],
    laborPrice,
    editingJob,
}: {
    stringReferences?: StringReference[]
    laborPrice: number
    editingJob?: EditableJob
}) {
    const router = useRouter()
    const [firstName, setFirstName] = useState(editingJob?.firstName ?? '')
    const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Form states
    const [sport, setSport] = useState(editingJob?.sport ?? '')
    const [tension, setTension] = useState(editingJob?.tension ?? '')
    const [selectedStringId, setSelectedStringId] = useState(editingJob?.stringId?.toString() ?? '')
    const [stringSource, setStringSource] = useState<'shop' | 'player'>(editingJob?.stringSource ?? 'shop')

    // Credit logic
    const [showCredit, setShowCredit] = useState(Boolean(editingJob?.discount))
    const [creditAmount, setCreditAmount] = useState(editingJob?.discount ? editingJob.discount.toString() : '')

    const formRef = useRef<HTMLFormElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const tensionInputRef = useRef<HTMLInputElement>(null)
    const canAddSecondTension = /^\d{1,2}([.,]\d)?$/.test(tension)
    const selectedString = stringReferences.find((reference) => reference.id.toString() === selectedStringId)
    const stringPrice = stringSource === 'shop' ? selectedString?.price ?? 0 : 0
    const standardPrice = Math.round((laborPrice + stringPrice) * 100) / 100
    const parsedCredit = Number(creditAmount)
    const appliedCredit = showCredit && Number.isFinite(parsedCredit) ? Math.max(0, parsedCredit) : 0
    const finalPrice = Math.max(0, Math.round((standardPrice - appliedCredit) * 100) / 100)
    const isDirty = Boolean(firstName || sport || tension || selectedStringId || stringSource !== 'shop' || showCredit)

    useEffect(() => {
        if (editingJob) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [editingJob])

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

    const resetForm = () => {
        formRef.current?.reset()
        setFirstName('')
        setSport('')
        setTension('')
        setSelectedStringId('')
        setStringSource('shop')
        setShowCredit(false)
        setCreditAmount('')
        setError('')
    }

    const handleCancel = () => {
        if (editingJob) router.replace('/dashboard', { scroll: false })
        else resetForm()
    }

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setSubmitting(true)

        try {
            if (editingJob) {
                await updateJob(editingJob.id, formData)
                router.replace('/dashboard', { scroll: false })
            } else {
                await createJob(formData)
                resetForm()
            }
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’enregistrer ce cordage')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card ref={cardRef} className="sport-panel mb-8 scroll-mt-24">
            <CardHeader className="border-b border-line bg-ink px-5 py-4 text-white dark:bg-surface-strong">
                <CardTitle as="h2" className="flex items-center justify-between gap-3 font-display text-2xl font-bold uppercase tracking-tight">
                    {editingJob ? (
                        <span className="flex items-center gap-2"><Pencil className="h-5 w-5 text-acid" /> Modifier la pose</span>
                    ) : (
                        <span className="flex items-center gap-2"><Crosshair className="h-5 w-5 text-acid" /> Nouvelle pose</span>
                    )}
                    <span className="hidden text-xs font-semibold tracking-[.16em] text-stone-400 sm:inline">{editingJob ? editingJob.firstName : 'Entrée atelier'}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
                <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">

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
                    <div className="md:col-span-2 relative" ref={wrapperRef}>
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
                                    defaultValue={editingJob?.playerStringName ?? ''}
                                    placeholder="Marque / modèle (facultatif)"
                                />
                            </>
                        )}
                    </div>

                    {/* Tension */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="job-tension"
                            className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted"
                        >
                            Tension
                        </label>

                        <div className="relative">
                            <Input
                                ref={tensionInputRef}
                                name="tension"
                                id="job-tension"
                                type="text"
                                inputMode="decimal"
                                placeholder="23 ou 23/24"
                                value={tension}
                                onChange={(e) => {
                                    const value = e.target.value

                                    if (/^\d{0,2}([.,]\d?)?(\/\d{0,2}([.,]\d?)?)?$/.test(value)) {
                                        setTension(value)
                                    }
                                }}
                                pattern="\d{1,2}([.,]\d+)?(\/\d{1,2}([.,]\d+)?)?"
                                className={`${canAddSecondTension ? 'pr-14' : ''} font-display text-lg font-semibold tabular-nums`}
                                required
                            />
                            {canAddSecondTension && (
                                <button
                                    type="button"
                                    aria-label="Ajouter une seconde tension"
                                    // Garde le focus sur l'input pour ne pas fermer le clavier mobile
                                    onPointerDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setTension((value) => value.includes('/') ? value : `${value}/`)
                                        tensionInputRef.current?.focus()
                                    }}
                                    className="absolute inset-y-1 right-1 flex w-11 touch-manipulation items-center justify-center rounded-sm border border-line bg-surface font-display text-xl font-bold text-ink transition-colors hover:border-ink active:bg-acid active:text-acid-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid dark:text-white dark:hover:border-acid"
                                >
                                    /
                                </button>
                            )}
                        </div>
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
                                    className="pr-6 font-display text-lg font-semibold tabular-nums"
                                />
                                <span className="absolute right-2 top-3 text-sm text-muted">€</span>
                            </div>

                            {showCredit ? (
                                <div className="flex items-center gap-1 animate-in slide-in-from-left-2 duration-200">
                                    <div className="relative w-24">
                                        <Input
                                            name="discount"
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max={standardPrice}
                                            aria-label="Montant de la remise"
                                            placeholder="Remise"
                                            value={creditAmount}
                                            onChange={(e) => setCreditAmount(e.target.value)}
                                            className="pr-6 text-sm"
                                        />
                                        <span className="absolute right-2 top-3 text-sm text-muted">€</span>
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
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowCredit(true)}
                                    className="h-11 px-3 text-sm font-semibold text-muted hover:text-ink dark:hover:text-acid"
                                    title="Ajouter une remise"
                                >
                                    - €
                                </Button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div role="alert" className="md:col-span-12 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="md:col-span-12 mt-2 flex flex-col-reverse gap-3 sm:flex-row">
                        {(isDirty || editingJob) && (
                            <Button type="button" variant="outline" size="lg" onClick={handleCancel} disabled={submitting} className="gap-2 sm:w-48">
                                <X className="h-4 w-4" />
                                Annuler
                            </Button>
                        )}
                        <Button type="submit" disabled={submitting} size="lg" className="flex-1 gap-2">
                            {editingJob ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {submitting
                                ? 'Enregistrement…'
                                : editingJob ? 'Enregistrer les modifications' : 'Ajouter au plan de travail'}
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
