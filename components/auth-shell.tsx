import type { ReactNode } from 'react'
import Link from 'next/link'
import { BrandLockup } from './brand-mark'
import { RacketGraphic } from './racket-graphic'
import { ThemeToggle } from './theme-toggle'

export function AuthShell({ eyebrow, title, description, children }: {
    eyebrow: string
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <div className="grid min-h-dvh bg-canvas lg:grid-cols-[.85fr_1.15fr]">
            <aside className="relative hidden overflow-hidden border-r border-white/10 bg-[#171c19] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                <Link href="/" className="relative z-10 w-fit text-white"><BrandLockup /></Link>
                <div className="pointer-events-none absolute inset-x-6 top-24 h-[62%] text-stone-300 opacity-60"><RacketGraphic /></div>
                <div className="court-lines absolute inset-0 opacity-20" />
                <div className="relative z-10 max-w-sm">
                    <p className="eyebrow mb-3 !text-acid">Atelier en ligne</p>
                    <p className="font-display text-6xl font-bold uppercase leading-[.82] tracking-tight">Prêt pour la prochaine raquette.</p>
                    <div className="mt-8 h-1 w-24 bg-acid" />
                </div>
            </aside>

            <main className="relative flex min-h-dvh flex-col">
                <header className="flex h-20 items-center justify-between px-5 sm:px-8 lg:justify-end">
                    <Link href="/" className="lg:hidden"><BrandLockup compact /></Link>
                    <ThemeToggle />
                </header>
                <div className="flex flex-1 items-center justify-center px-5 pb-16 sm:px-8">
                    <div className="motion-enter w-full max-w-md">
                        <p className="eyebrow mb-3">{eyebrow}</p>
                        <h1 className="font-display text-5xl font-bold uppercase leading-[.88] tracking-tight sm:text-6xl">{title}</h1>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{description}</p>
                        <div className="mt-8">{children}</div>
                    </div>
                </div>
            </main>
        </div>
    )
}
