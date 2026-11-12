'use client'

import { useState } from 'react'
import { addRacketBrand } from '@/app/settings/actions'
import { Button } from './button'
import { Input } from './input'

export function RacketBrandSettings({ brands }: { brands: string[] }) {
    const [message, setMessage] = useState('')
    const [pending, setPending] = useState(false)
    return <section className="border border-line bg-surface p-5 space-y-4 lg:col-span-2">
        <h2 className="font-display text-2xl font-bold uppercase">Marques de raquettes</h2>
        <p className="text-sm text-muted">Les marques ajoutées seront disponibles dans le formulaire de pose.</p>
        <div className="flex flex-wrap gap-2">{brands.map(brand => <span key={brand} className="border border-line px-3 py-1 text-sm">{brand}</span>)}</div>
        <form className="flex flex-col sm:flex-row gap-3" action={async data => {
            setPending(true); setMessage('')
            try { await addRacketBrand(data); setMessage('Marque ajoutée au menu.') }
            catch (e) { setMessage(e instanceof Error ? e.message : 'Enregistrement impossible') }
            finally { setPending(false) }
        }}>
            <label className="flex-1 space-y-2">Ajouter une marque<Input name="name" maxLength={80} placeholder="Ex. Kawasaki" required /></label>
            <Button disabled={pending} className="self-end" type="submit">{pending ? 'Ajout…' : 'Ajouter la marque'}</Button>
        </form>
        {message && <p role="status" className="text-sm">{message}</p>}
    </section>
}
