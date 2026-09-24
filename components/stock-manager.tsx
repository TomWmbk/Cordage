'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Plus, Pencil, Trash2, X, Search, CircleDotDashed } from 'lucide-react'
import { createStringReference, updateStringReference, deleteStringReference } from '@/app/stock/actions'
import { inputStyles } from '@/lib/styles'

type StringReference = {
    id: number
    brand: string
    model: string
    gauge: string | null
    price: number
    type: string | null
    isInStock: boolean
}

export function StockManager({ initialStrings }: { initialStrings: StringReference[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingString, setEditingString] = useState<StringReference | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    const filteredStrings = initialStrings.filter(s =>
        s.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.model.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setSubmitting(true)
        try {
            if (editingString) {
                await updateStringReference(editingString.id, formData)
            } else {
                await createStringReference(formData)
            }
            setIsModalOpen(false)
            setEditingString(null)
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’enregistrer cette référence')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette référence ?')) {
            await deleteStringReference(id)
        }
    }

    const openEditModal = (str: StringReference) => {
        setError('')
        setEditingString(str)
        setIsModalOpen(true)
    }

    const openCreateModal = () => {
        setError('')
        setEditingString(null)
        setIsModalOpen(true)
    }

    useEffect(() => {
        if (!isModalOpen) return
        closeButtonRef.current?.focus()
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsModalOpen(false)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [isModalOpen])

    return (
        <div className="motion-enter-delayed space-y-6">
            <div className="flex flex-col items-stretch justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                        aria-label="Rechercher un cordage"
                        placeholder="Rechercher un cordage..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={openCreateModal} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une référence
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStrings.map((str) => (
                    <Card key={str.id} className="group relative overflow-hidden transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-ink/40 hover:shadow-[0_16px_34px_color-mix(in_srgb,var(--foreground)_8%,transparent)] dark:hover:border-acid/50">
                        <CardContent className="p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center border border-ink/15 bg-ink/5 dark:border-white/15 dark:bg-white/5"><CircleDotDashed className="h-6 w-6" /></span>
                                    <div className="min-w-0">
                                        <h3 className="font-display text-xl font-bold uppercase leading-none text-ink dark:text-white">{str.brand}</h3>
                                        <p className="mt-1 truncate text-sm text-muted">{str.model}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                                    <Button aria-label={`Modifier ${str.brand} ${str.model}`} variant="ghost" size="icon" className="h-9 w-9 text-muted hover:text-ink dark:hover:text-acid" onClick={() => openEditModal(str)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button aria-label={`Supprimer ${str.brand} ${str.model}`} variant="ghost" size="icon" className="h-9 w-9 text-muted hover:text-red-600 dark:hover:text-red-400" onClick={() => handleDelete(str.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                {str.gauge && (
                                    <span className="border border-line bg-surface-strong px-2 py-1 text-muted">
                                        {str.gauge} mm
                                    </span>
                                )}
                                {str.type && (
                                    <span className="border border-line bg-surface-strong px-2 py-1 text-muted">
                                        {str.type}
                                    </span>
                                )}
                                <span className={str.isInStock ? "border border-acid/70 bg-acid/15 px-2 py-1 font-semibold text-ink dark:text-acid" : "border border-red-400/50 bg-red-500/10 px-2 py-1 font-semibold text-red-700 dark:text-red-300"}>
                                    {str.isInStock ? 'En stock' : 'Rupture'}
                                </span>
                            </div>

                            <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                                <span className="eyebrow">Prix du cordage</span>
                                <span className="metric-number font-display text-3xl font-bold leading-none text-ink dark:text-white">{str.price.toFixed(2)} €</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredStrings.length === 0 && (
                <div role="status" className="court-lines border border-dashed border-line bg-surface px-4 py-14 text-center text-muted">
                    {initialStrings.length === 0 ? 'Aucune référence. Ajoutez votre premier cordage.' : 'Aucun cordage ne correspond à cette recherche.'}
                </div>
            )}

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#171c19]/70 p-4 backdrop-blur-sm motion-enter"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="stock-modal-title"
                        className="max-h-[90vh] w-full max-w-md overflow-auto border border-line bg-surface shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-line bg-ink p-4 text-white dark:bg-surface-strong">
                            <h2 id="stock-modal-title" className="font-display text-2xl font-bold uppercase">
                                {editingString ? 'Modifier la référence' : 'Nouvelle référence'}
                            </h2>
                            <Button ref={closeButtonRef} aria-label="Fermer" variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setIsModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form action={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="string-brand" className="text-sm font-semibold text-ink dark:text-white">Marque</label>
                                    <Input id="string-brand" name="brand" maxLength={80} defaultValue={editingString?.brand} placeholder="ex: Babolat" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="string-model" className="text-sm font-semibold text-ink dark:text-white">Modèle</label>
                                    <Input id="string-model" name="model" maxLength={120} defaultValue={editingString?.model} placeholder="ex: RPM Blast" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="string-gauge" className="text-sm font-semibold text-ink dark:text-white">Jauge</label>
                                    <Input id="string-gauge" name="gauge" maxLength={20} defaultValue={editingString?.gauge || ''} placeholder="ex: 1.25" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="string-type" className="text-sm font-semibold text-ink dark:text-white">Type</label>
                                    <select
                                        id="string-type"
                                        name="type"
                                        defaultValue={editingString?.type || ''}
                                        className={inputStyles}
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="Monofilament">Monofilament</option>
                                        <option value="Multifilament">Multifilament</option>
                                        <option value="Boyau">Boyau</option>
                                        <option value="Hybride">Hybride</option>
                                        <option value="Synthétique">Synthétique</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="string-price" className="text-sm font-semibold text-ink dark:text-white">Prix du cordage (€)</label>
                                <Input id="string-price" name="price" type="number" min="0.01" max="10000" step="0.01" defaultValue={editingString?.price} placeholder="25.00" required />
                            </div>

                            {error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">{error}</div>}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isInStock"
                                    id="isInStock"
                                    defaultChecked={editingString ? editingString.isInStock : true}
                                    className="h-4 w-4 accent-[var(--accent)]"
                                />
                                <label htmlFor="isInStock" className="text-sm font-semibold text-ink dark:text-white">En stock</label>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Enregistrement…' : 'Enregistrer'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
