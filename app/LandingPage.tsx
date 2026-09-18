import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Wrench, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
    const session = await getSession()

    if (session?.user) {
        if (session.user.role === 'player') {
            redirect('/player/home')
        } else {
            redirect('/dashboard')
        }
    }
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-3xl dark:bg-emerald-500/5"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/5"></div>
            </div>

            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="z-10 text-center mb-12 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                    Gérez vos cordages <span className="text-emerald-600 dark:text-emerald-500">simplement</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    La plateforme tout-en-un pour les cordeurs et les joueurs de raquette.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10">
                {/* Stringer Card */}
                <Link href="/login?role=stringer" className="group">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                        <CardHeader className="text-center pt-10 pb-4">
                            <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Wrench className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Je suis Cordeur</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-10 px-8">
                            <p className="text-slate-600 dark:text-slate-400">
                                Gérez vos clients, votre stock de bobines et suivez votre chiffre d'affaires en temps réel.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Player Card */}
                <Link href="/login?role=player" className="group">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                        <CardHeader className="text-center pt-10 pb-4">
                            <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Je suis Joueur</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-10 px-8">
                            <p className="text-slate-600 dark:text-slate-400">
                                Suivez l'état de vos raquettes, consultez votre historique et réservez une pose.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <footer className="absolute bottom-4 text-center text-sm text-slate-400 dark:text-slate-600">
                &copy; {new Date().getFullYear()} Cordage. Tous droits réservés.
            </footer>
        </div>
    )
}
