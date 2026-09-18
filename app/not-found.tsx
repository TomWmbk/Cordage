import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BrandLockup } from '@/components/brand-mark'

export default function NotFound() {
    return (
        <main className="court-lines flex min-h-dvh items-center justify-center bg-canvas px-5 text-ink dark:text-white">
            <div className="motion-enter w-full max-w-2xl border border-line bg-surface p-8 sm:p-12">
                <BrandLockup />
                <p className="mt-16 font-display text-[8rem] font-extrabold leading-[.7] text-transparent [-webkit-text-stroke:1.5px_var(--foreground)] sm:text-[12rem]">404</p>
                <p className="eyebrow mt-10">Hors du court</p>
                <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none">Cette page n’est pas dans l’atelier.</h1>
                <Link href="/" className="mt-8 inline-flex items-center gap-2 border-b-2 border-acid pb-1 text-sm font-bold">
                    <ArrowLeft className="h-4 w-4" /> Retour à l’accueil
                </Link>
            </div>
        </main>
    )
}
