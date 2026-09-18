'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, LayoutDashboard, Menu, Package, User, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ThemeToggle } from './theme-toggle'
import { LogoutButton } from './logout-button'
import { cn } from '@/lib/utils'

const stringerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/stock', label: 'Stock', icon: Package },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
]

export function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const links = session?.user?.role === 'stringer' ? stringerLinks : []

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4">
                <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-80 dark:text-white">
                    <span className="sm:hidden">Cordage</span>
                    <span className="hidden sm:inline">Gestion de cordage</span>
                </Link>

                <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={pathname === href ? 'page' : undefined}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                pathname === href
                                    ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                            )}
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2">
                    <ThemeToggle />
                    {session && (
                        <>
                            <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:flex">
                                <User className="h-4 w-4" aria-hidden="true" />
                                {session.user?.name}
                            </span>
                            <LogoutButton />
                        </>
                    )}
                    {links.length > 0 && (
                        <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden dark:border-slate-800 dark:text-slate-200"
                            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    )}
                </div>
            </div>

            {menuOpen && links.length > 0 && (
                <nav id="mobile-navigation" aria-label="Navigation mobile" className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-slate-800">
                    <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2">
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                aria-current={pathname === href ? 'page' : undefined}
                                className={cn(
                                    'flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs font-medium',
                                    pathname === href
                                        ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-300'
                                )}
                            >
                                <Icon className="h-5 w-5" aria-hidden="true" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    )
}
