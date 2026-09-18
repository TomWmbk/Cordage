'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { AuthShell } from '@/components/auth-shell'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError('')
        if (password !== confirmPassword) return setError('Les mots de passe ne correspondent pas.')
        if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.')
        if (username.trim().length < 3) return setError('Le nom d’utilisateur doit contenir au moins 3 caractères.')

        setLoading(true)
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role: 'stringer' }),
            })
            const data = await response.json()
            if (!response.ok) return setError(data.error || 'La création du compte a échoué.')
            router.push('/login?role=stringer&registered=true')
        } catch {
            setError('La création du compte a échoué. Réessayez.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthShell eyebrow="Nouvel atelier" title="Préparer le terrain." description="Créez votre espace cordeur. Vos clients, vos bobines et votre activité resteront séparés des autres ateliers.">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="register-username" className="mb-2 block text-sm font-semibold">Nom d’utilisateur</label>
                    <div className="relative">
                        <UserRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
                        <Input id="register-username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Nom de l’atelier ou identifiant" className="pl-10" required minLength={3} maxLength={50} />
                    </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="register-password" className="mb-2 block text-sm font-semibold">Mot de passe</label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
                            <Input id="register-password" name="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 caractères min." className="pl-10" required minLength={8} maxLength={128} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="register-password-confirmation" className="mb-2 block text-sm font-semibold">Confirmation</label>
                        <Input id="register-password-confirmation" name="passwordConfirmation" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Même mot de passe" required minLength={8} maxLength={128} />
                    </div>
                </div>

                {error && <div role="alert" className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>}

                <Button type="submit" disabled={loading} size="lg" className="group w-full justify-between">
                    {loading ? 'Création en cours…' : 'Créer mon atelier'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-center text-sm text-muted">
                    Déjà équipé ?{' '}
                    <Link href="/login?role=stringer" className="font-semibold text-ink underline decoration-acid decoration-2 underline-offset-4 dark:text-white">Se connecter</Link>
                </p>
            </form>
        </AuthShell>
    )
}
