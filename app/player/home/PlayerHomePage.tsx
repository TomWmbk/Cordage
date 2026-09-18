import { LogoutButton } from '@/components/logout-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { requireRole } from '@/lib/auth'

export default async function PlayerHomePage() {
    const user = await requireRole('player')

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 pt-20 dark:bg-slate-950">
            <div className="absolute right-4 top-4 flex gap-2">
                <ThemeToggle />
                <LogoutButton />
            </div>

            <div className="text-center max-w-md">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Bienvenue {user?.username}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Votre compte est prêt. Le suivi détaillé de vos raquettes sera ajouté dans une prochaine version.
                </p>

                <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        Statut du compte : <span className="text-emerald-600 font-medium">Actif</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
