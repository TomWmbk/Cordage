import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
    return (
        <span className={cn('brand-mark', className)} aria-hidden="true">
            <span className="brand-mark__head" />
            <span className="brand-mark__handle" />
        </span>
    )
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
    return (
        <span className="inline-flex items-center gap-2.5">
            <BrandMark />
            <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.045em]">
                {compact ? 'Cordage' : 'Atelier Cordage'}
            </span>
        </span>
    )
}
