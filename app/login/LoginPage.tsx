'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Header } from '@/components/header'

export const dynamic = 'force-dynamic'

function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const role = searchParams.get('role') || 'stringer'

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Identifiants incorrects')
            } else if (result?.ok) {
                // Force reload to update session
                if (role === 'player') {
                    window.location.href = '/player/home'
                } else {
                    window.location.href = '/dashboard'
                }
            }
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
                    Connexion {role === 'player' ? 'Joueur' : 'Cordeur'}
                </CardTitle>
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                    {role === 'player' ? 'Accédez à votre espace joueur' : 'Gérez votre activité de cordage'}
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
                            placeholder="Entrez votre nom d'utilisateur"
                            required
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
                            placeholder="Entrez votre mot de passe"
                            required
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                            {success}
                        </div>
                    )}

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
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>

                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                        Pas encore de compte ?{' '}
                        <Link href={`/register?role=${role}`} className="text-emerald-600 hover:underline dark:text-emerald-400">
                            Créer un compte {role === 'player' ? 'Joueur' : 'Cordeur'}
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <Suspense fallback={<div>Chargement...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
