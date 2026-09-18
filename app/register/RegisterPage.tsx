'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

function RegisterForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const role = searchParams.get('role') || 'stringer'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères')
            return
        }

        if (username.length < 3) {
            setError("Le nom d'utilisateur doit contenir au moins 3 caractères")
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Une erreur est survenue')
                return
            }

            // Succès - redirection vers login
            router.push(`/login?registered=true&role=${role}`)
        } catch (error) {
            setError('Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-slate-200 shadow-lg dark:border-slate-800">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">
                    Créer un compte {role === 'player' ? 'Joueur' : 'Cordeur'}
                </CardTitle>
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                    {role === 'player' ? 'Rejoignez la communauté' : 'Commencez à gérer votre activité'}
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Nom d'utilisateur
                        </label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choisissez un nom d'utilisateur"
                            required
                            minLength={3}
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Mot de passe
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 caractères"
                            required
                            minLength={6}
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Confirmer le mot de passe
                        </label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Retapez votre mot de passe"
                            required
                            minLength={6}
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </Button>

                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                        Déjà un compte ?{' '}
                        <Link href={`/login?role=${role}`} className="text-emerald-600 hover:underline dark:text-emerald-400">
                            Se connecter
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <Suspense fallback={<div>Chargement...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    )
}
