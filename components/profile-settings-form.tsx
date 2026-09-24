'use client'

import { useState } from 'react'
import { Mail, Save, UserRound } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { updateProfileSettings } from '@/app/settings/actions'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'

export function ProfileSettingsForm({ username, email }: { username: string; email: string }) {
    const { update: updateSession } = useSession()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setSuccess('')
        setSubmitting(true)
        try {
            await updateProfileSettings(formData)
            await updateSession()
            setSuccess('Profil enregistré.')
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’enregistrer le profil')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section id="profile" className="motion-enter-delayed scroll-mt-24">
            <Card className="sport-panel">
                <CardHeader className="border-b border-line bg-ink px-5 py-4 text-white dark:bg-surface-strong">
                    <CardTitle as="h2" className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-tight">
                        <UserRound className="h-5 w-5 text-acid" aria-hidden="true" />
                        Profil
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <form action={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="profile-username" className="block text-sm font-semibold text-ink dark:text-white">Nom d’utilisateur</label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
                                <Input id="profile-username" name="username" autoComplete="username" defaultValue={username} minLength={3} maxLength={50} className="pl-10" required />
                            </div>
                            <p className="text-xs text-muted">Utilisé pour vous connecter et affiché dans l’application.</p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="profile-email" className="block text-sm font-semibold text-ink dark:text-white">Adresse e-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
                                <Input id="profile-email" name="email" type="email" autoComplete="email" defaultValue={email} placeholder="contact@atelier.fr" maxLength={254} className="pl-10" required />
                            </div>
                        </div>
                        {error && <p role="alert" className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
                        {success && <p role="status" className="border-l-2 border-acid bg-acid/12 px-4 py-3 text-sm text-ink dark:text-white">{success}</p>}
                        <Button type="submit" disabled={submitting} className="w-full gap-2 sm:w-auto">
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {submitting ? 'Enregistrement…' : 'Enregistrer le profil'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}
