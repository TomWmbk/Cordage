import { LogoutButton } from '@/components/logout-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { getCurrentUserId } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function PlayerHomePage() {
    const userId = await getCurrentUserId()
    const user = await db.user.findUnique({ where: { id: userId } })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 right-4 flex gap-2">
                <ThemeToggle />
                <LogoutButton />
            </div>

            <div className="text-center max-w-md">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Bienvenue {user?.username}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Votre espace joueur est en cours de construction. Vous pourrez bientôt suivre vos raquettes ici.
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
