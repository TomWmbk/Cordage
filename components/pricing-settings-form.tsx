'use client'

import { useState } from 'react'
import { Save, Wrench } from 'lucide-react'
import { updatePricingSettings } from '@/app/settings/actions'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'

export function PricingSettingsForm({ laborPrice }: { laborPrice: number }) {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setSuccess('')
        setSubmitting(true)
        try {
            await updatePricingSettings(formData)
            setSuccess('Prix de pose enregistré.')
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’enregistrer le tarif')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="motion-enter-delayed max-w-2xl">
            <Card className="sport-panel">
                <CardHeader className="border-b border-line bg-ink px-5 py-4 text-white dark:bg-surface-strong">
                    <CardTitle as="h2" className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-tight">
                        <Wrench className="h-5 w-5 text-acid" aria-hidden="true" />
                        Tarif de pose
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-5 sm:p-6">
                    <p className="text-sm leading-6 text-muted">
                        Avec une bobine de l’atelier, le total correspond à la pose plus le prix du cordage. Avec la bobine du joueur, seule la pose est facturée.
                    </p>
                    <form action={handleSubmit} className="space-y-5">
                        <div className="max-w-xs space-y-2">
                            <label htmlFor="labor-price" className="block text-sm font-semibold text-ink dark:text-white">Prix de la pose</label>
                            <div className="relative">
                                <Input
                                    id="labor-price"
                                    name="laborPrice"
                                    type="number"
                                    min="0"
                                    max="10000"
                                    step="0.5"
                                    defaultValue={laborPrice}
                                    className="pr-9 font-display text-xl font-semibold tabular-nums"
                                    required
                                />
                                <span className="pointer-events-none absolute right-3 top-3 text-sm text-muted">€</span>
                            </div>
                        </div>
                        {error && <p role="alert" className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
                        {success && <p role="status" className="border-l-2 border-acid bg-acid/12 px-4 py-3 text-sm text-ink dark:text-white">{success}</p>}
                        <Button type="submit" disabled={submitting} className="w-full gap-2 sm:w-auto">
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {submitting ? 'Enregistrement…' : 'Enregistrer le tarif'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}
