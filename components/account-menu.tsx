'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { ChevronDown, LogOut, Pencil, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AccountMenu({ username }: { username: string }) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (!open) return

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
        }
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return
            setOpen(false)
            triggerRef.current?.focus()
        }

        document.addEventListener('pointerdown', closeOnOutsideClick)
        document.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [open])

    const handleLogout = async () => {
        setOpen(false)
        await signOut({ redirect: false })
        router.replace('/login?role=stringer')
        router.refresh()
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-line bg-surface-strong px-2.5 text-ink transition-colors hover:border-ink sm:px-3 dark:text-white dark:hover:border-acid"
                aria-label={`Compte de ${username}`}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls="account-menu"
                onClick={() => setOpen((current) => !current)}
            >
                <UserRound className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                <span className="hidden max-w-32 truncate text-xs font-semibold lg:block">{username}</span>
                <ChevronDown className={cn('hidden h-3.5 w-3.5 transition-transform lg:block', open && 'rotate-180')} aria-hidden="true" />
            </button>

            {open && (
                <div
                    id="account-menu"
                    role="menu"
                    aria-label="Menu du compte"
                    className="motion-enter absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 border border-line bg-surface p-2 shadow-xl shadow-black/10 dark:bg-surface-strong"
                >
                    <div className="border-b border-line px-3 py-2.5">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">Compte</p>
                        <p className="mt-1 truncate text-sm font-semibold text-ink dark:text-white">{username}</p>
                    </div>
                    <Link
                        href="/settings#profile"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="mt-1 flex min-h-11 items-center gap-3 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-acid focus-visible:bg-acid focus-visible:outline-none dark:text-white dark:hover:text-acid-ink dark:focus-visible:text-acid-ink"
                    >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Modifier le nom d’utilisateur
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm font-semibold text-red-700 transition-colors hover:bg-red-500/10 focus-visible:bg-red-500/10 focus-visible:outline-none dark:text-red-300"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Se déconnecter
                    </button>
                </div>
            )}
        </div>
    )
}
