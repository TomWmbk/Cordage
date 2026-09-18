'use client'
import Link from 'next/link'
import { Activity, User } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { LogoutButton } from './logout-button'
import { headerStyles } from '../lib/styles'
import { useSession } from 'next-auth/react'

export function Header() {
    const { data: session } = useSession()

    return (
        <header className={headerStyles.wrapper}>
            <div className={headerStyles.container}>
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <span className={headerStyles.logo}>Gestion de cordage</span>
                    </Link>
                </div>

                <nav className={headerStyles.nav}>
                    {session && (
                        <>
                            <Link href="/" className={headerStyles.link}>
                                Dashboard
                            </Link>
                            <Link href="/stock" className={headerStyles.link}>
                                Stock
                            </Link>
                            <Link href="/stats" className={headerStyles.link}>
                                Stats
                            </Link>
                        </>
                    )}

                    <ThemeToggle />

                    {session && (
                        <>
                            <button
                                className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                title={`Compte : ${session.user?.name}`}
                                onClick={() => alert("Fonctionnalité de profil à venir !")}
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">{session.user?.name}</span>
                            </button>
                            <LogoutButton />
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
