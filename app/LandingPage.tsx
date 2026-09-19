import Link from 'next/link'
import { ArrowUpRight, Gauge, PackageCheck, TimerReset } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { BrandLockup } from '@/components/brand-mark'
import { RacketGraphic } from '@/components/racket-graphic'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { destinationForRole } from '@/lib/domain'

const workflow = [
    { number: '01', title: 'Enregistrer', text: 'Client, sport, tension et cordage en quelques gestes.' },
    { number: '02', title: 'Suivre', text: 'Pose, règlement et retour restent visibles au même endroit.' },
    { number: '03', title: 'Piloter', text: 'Stock et activité donnent une lecture nette de l’atelier.' },
]

export default async function LandingPage() {
    const session = await getSession()
    if (session?.user) redirect(destinationForRole(session.user.role))

    return (
        <div className="min-h-dvh overflow-hidden bg-canvas text-ink dark:text-white">
            <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link href="/" aria-label="Atelier Cordage — accueil"><BrandLockup /></Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link href="/login?role=stringer" className="hidden h-10 items-center border border-ink px-4 text-sm font-semibold transition-colors hover:bg-ink hover:text-white sm:inline-flex dark:border-white dark:hover:bg-white dark:hover:text-ink">
                        Connexion
                    </Link>
                </div>
            </header>

            <main>
                <section className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-4 lg:py-16">
                    <div className="motion-enter relative z-10 max-w-3xl">
                        <div className="mb-7 inline-flex items-center gap-3 border-l-2 border-acid pl-3">
                            <span className="eyebrow">Cockpit du cordeur</span>
                            <span className="h-px w-10 bg-ink/25 dark:bg-white/25" />
                            <span className="text-xs font-semibold tabular-nums text-muted">V2.0</span>
                        </div>
                        <h1 className="font-display text-[clamp(4.6rem,12vw,9.5rem)] font-extrabold uppercase leading-[.73] tracking-[-.045em]">
                            Chaque<br />raquette.<br />
                            <span className="text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]">Sous contrôle.</span>
                        </h1>
                        <p className="mt-8 max-w-xl text-base leading-7 text-stone-600 sm:text-lg dark:text-stone-400">
                            L’atelier numérique qui garde vos poses, vos règlements et vos bobines parfaitement tendus.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/login?role=stringer" className="group inline-flex h-13 items-center justify-between gap-8 border border-ink bg-ink px-5 text-sm font-bold text-white shadow-[5px_5px_0_var(--accent)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--accent)] dark:border-acid dark:bg-acid dark:text-acid-ink">
                                Ouvrir mon atelier
                                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                            <Link href="/register" className="inline-flex h-13 items-center justify-center border border-line bg-surface px-5 text-sm font-semibold transition-colors hover:border-ink dark:hover:border-acid">
                                Créer un compte cordeur
                            </Link>
                        </div>
                    </div>

                    <div className="motion-enter-delayed relative mx-auto h-[28rem] w-full max-w-lg text-ink sm:h-[36rem] dark:text-stone-100">
                        <div className="absolute inset-8 rotate-3 border border-ink/15 dark:border-white/15" />
                        <div className="court-lines absolute inset-x-0 top-1/2 h-52 -translate-y-1/2 border-y border-ink/10 dark:border-white/10" />
                        <div className="absolute inset-0 p-10 sm:p-14"><RacketGraphic /></div>
                        <div className="absolute bottom-12 left-0 border-l-2 border-acid bg-surface/90 px-4 py-3 backdrop-blur">
                            <p className="text-xs font-semibold text-muted">TENNIS · BADMINTON · SQUASH</p>
                        </div>
                    </div>
                </section>

                <section className="border-y border-ink/10 bg-ink text-white dark:border-white/10 dark:bg-surface">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:px-8 md:grid-cols-3">
                        {[
                            { icon: TimerReset, value: '3 états', label: 'pose · payé · rendu' },
                            { icon: PackageCheck, value: 'Stock net', label: 'références disponibles' },
                            { icon: Gauge, value: 'Vue directe', label: 'activité et bénéfice' },
                        ].map(({ icon: Icon, value, label }) => (
                            <div key={value} className="flex items-center gap-4 border-white/10 py-6 md:border-r md:px-6 first:pl-0 last:border-0">
                                <Icon className="h-6 w-6 text-acid" />
                                <div><p className="font-display text-2xl font-bold uppercase leading-none">{value}</p><p className="mt-1 text-xs text-stone-400">{label}</p></div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
                    <div className="mb-12 max-w-2xl">
                        <p className="eyebrow mb-3">Un flux sans friction</p>
                        <h2 className="font-display text-5xl font-bold uppercase leading-[.9] tracking-tight sm:text-7xl">Du dépôt au retour.</h2>
                    </div>
                    <div className="grid border-y border-ink/15 md:grid-cols-3 dark:border-white/15">
                        {workflow.map((item) => (
                            <article key={item.number} className="group relative border-b border-ink/15 px-1 py-8 md:border-b-0 md:border-r md:px-8 first:pl-0 last:border-0 dark:border-white/15">
                                <span className="font-display text-sm font-bold text-muted">/{item.number}</span>
                                <h3 className="mt-8 font-display text-3xl font-bold uppercase transition-transform duration-300 group-hover:translate-x-1">{item.title}</h3>
                                <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{item.text}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-ink/10 px-5 py-7 dark:border-white/10 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} Atelier Cordage</span>
                    <span>Conçu pour le rythme réel de l’atelier.</span>
                </div>
            </footer>
        </div>
    )
}
