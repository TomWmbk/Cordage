'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStrings.map((str) => (
                    <Card key={str.id} className="relative group hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{str.brand}</h3>
                                    <p className="text-slate-600 dark:text-slate-300">{str.model}</p>
                                </div>
                                <div className="flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                                    <Button aria-label={`Modifier ${str.brand} ${str.model}`} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" onClick={() => openEditModal(str)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button aria-label={`Supprimer ${str.brand} ${str.model}`} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" onClick={() => handleDelete(str.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 text-sm">
                                {str.gauge && (
                                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded dark:bg-slate-700 dark:text-slate-300">
                                        Jauge: {str.gauge}
                                    </span>
                                )}
                                {str.type && (
                                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded dark:bg-slate-700 dark:text-slate-300">
                                        {str.type}
                                    </span>
                                )}
                                <span className={str.isInStock ? "bg-emerald-100 text-emerald-700 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 px-2 py-1 rounded dark:bg-red-900/30 dark:text-red-400"}>
                                    {str.isInStock ? 'En stock' : 'Rupture'}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Prix de vente</span>
                                <span className="font-bold text-lg text-slate-900 dark:text-white">{str.price.toFixed(2)} €</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredStrings.length === 0 && (
                <div role="status" className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    {initialStrings.length === 0 ? 'Aucune référence. Ajoutez votre premier cordage.' : 'Aucun cordage ne correspond à cette recherche.'}
                </div>
            )}

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="stock-modal-title"
                        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 id="stock-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                                {editingString ? 'Modifier la référence' : 'Nouvelle référence'}
                            </h2>
                            <Button ref={closeButtonRef} aria-label="Fermer" variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form action={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="string-brand" className="text-sm font-medium text-slate-700 dark:text-slate-300">Marque</label>
                                    <Input id="string-brand" name="brand" maxLength={80} defaultValue={editingString?.brand} placeholder="ex: Babolat" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="string-model" className="text-sm font-medium text-slate-700 dark:text-slate-300">Modèle</label>
                                    <Input id="string-model" name="model" maxLength={120} defaultValue={editingString?.model} placeholder="ex: RPM Blast" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="string-gauge" className="text-sm font-medium text-slate-700 dark:text-slate-300">Jauge</label>
                                    <Input id="string-gauge" name="gauge" maxLength={20} defaultValue={editingString?.gauge || ''} placeholder="ex: 1.25" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="string-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
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
                                <label htmlFor="string-price" className="text-sm font-medium text-slate-700 dark:text-slate-300">Prix de vente (€)</label>
                                <Input id="string-price" name="price" type="number" min="0.01" max="10000" step="0.01" defaultValue={editingString?.price} placeholder="25.00" required />
                            </div>

                            {error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">{error}</div>}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isInStock"
                                    id="isInStock"
                                    defaultChecked={editingString ? editingString.isInStock : true}
                                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                />
                                <label htmlFor="isInStock" className="text-sm font-medium text-slate-700 dark:text-slate-300">En stock</label>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Annuler</Button>
                                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">{submitting ? 'Enregistrement…' : 'Enregistrer'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
