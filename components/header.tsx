'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, LayoutDashboard, Menu, Package, Settings, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ThemeToggle } from './theme-toggle'
import { AccountMenu } from './account-menu'
import { cn } from '@/lib/utils'
import { BrandLockup } from './brand-mark'

const stringerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/stock', label: 'Stock', icon: Package },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
    { href: '/settings', label: 'Paramètres', icon: Settings },
]

export function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const links = session?.user?.role === 'stringer' ? stringerLinks : []

    return (
        <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/92 backdrop-blur-xl dark:border-white/10">
            <div className="mx-auto flex min-h-17 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="shrink-0 text-ink transition-opacity hover:opacity-65 dark:text-white" aria-label="Atelier Cordage — accueil">
                    <span className="sm:hidden"><BrandLockup compact /></span>
                    <span className="hidden sm:inline"><BrandLockup /></span>
                </Link>

                <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={pathname === href ? 'page' : undefined}
                            className={cn(
                                'relative inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:origin-left after:bg-acid after:transition-transform',
                                pathname === href
                                    ? 'text-ink after:scale-x-100 dark:text-white'
                                    : 'text-muted after:scale-x-0 hover:text-ink dark:hover:text-white'
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
                        <AccountMenu username={session.user?.name || 'Mon compte'} />
                    )}
                    {links.length > 0 && (
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line bg-surface-strong text-ink transition-colors hover:border-ink md:hidden dark:text-white dark:hover:border-acid"
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
                <nav id="mobile-navigation" aria-label="Navigation mobile" className="motion-enter border-t border-line bg-surface px-4 py-3 md:hidden">
                    <div className="mx-auto grid max-w-6xl grid-cols-4 gap-1">
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                aria-current={pathname === href ? 'page' : undefined}
                                className={cn(
                                    'flex min-h-14 flex-col items-center justify-center gap-1 rounded-sm border px-2 py-2 text-xs font-semibold transition-colors',
                                    pathname === href
                                        ? 'border-ink bg-ink text-white dark:border-acid dark:bg-acid dark:text-acid-ink'
                                        : 'border-transparent text-muted hover:border-line hover:text-ink dark:hover:text-white'
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
