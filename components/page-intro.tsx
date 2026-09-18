import type { ReactNode } from 'react'

export function PageIntro({ eyebrow, title, description, action }: {
    eyebrow: string
    title: string
    description: string
    action?: ReactNode
}) {
    return (
        <div className="motion-enter mb-8 flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
            <div>
                <p className="eyebrow mb-2">{eyebrow}</p>
                <h1 className="font-display text-4xl font-bold uppercase leading-[.9] tracking-[-.02em] text-ink sm:text-5xl dark:text-white">
                    {title}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-400">{description}</p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    )
}
