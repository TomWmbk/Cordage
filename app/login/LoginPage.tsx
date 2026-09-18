'use client'

import { Suspense, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { AuthShell } from '@/components/auth-shell'

function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('Compte créé. Votre atelier est prêt.')
        }
    }, [searchParams])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const result = await signIn('credentials', { username, password, redirect: false })
            if (result?.error) setError('Nom d’utilisateur ou mot de passe incorrect.')
            else if (result?.ok) {
                router.replace('/dashboard')
                router.refresh()
            }
        } catch {
            setError('La connexion a échoué. Réessayez.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="login-username" className="mb-2 block text-sm font-semibold">Nom d’utilisateur</label>
                <div className="relative">
                    <UserRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
                    <Input id="login-username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Votre identifiant" className="pl-10" required />
                </div>
            </div>
            <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">Mot de passe</label>
                <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
                    <Input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" className="pl-10" required />
                </div>
            </div>

            {success && <div role="status" className="border-l-2 border-acid bg-acid/12 px-4 py-3 text-sm">{success}</div>}
            {error && <div role="alert" className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>}

            <Button type="submit" disabled={loading} size="lg" className="group w-full justify-between">
                {loading ? 'Connexion en cours…' : 'Entrer dans l’atelier'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-center text-sm text-muted">
                Première utilisation ?{' '}
                <Link href="/register" className="font-semibold text-ink underline decoration-acid decoration-2 underline-offset-4 dark:text-white">Créer un compte cordeur</Link>
            </p>
        </form>
    )
}

export default function LoginPage() {
    return (
        <AuthShell eyebrow="Accès cordeur" title="Reprendre la main." description="Retrouvez les poses en cours, les règlements et votre stock en un coup d’œil.">
            <Suspense fallback={<div className="h-72 animate-pulse bg-ink/5" aria-label="Chargement du formulaire" />}>
                <LoginForm />
            </Suspense>
        </AuthShell>
    )
}
