import { cva } from "class-variance-authority"

// Input Styles
export const inputStyles = "flex h-11 w-full rounded-sm border border-line bg-surface-strong px-3 py-2 text-sm text-ink ring-offset-canvas transition-[border-color,box-shadow,background-color] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-400 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:ring-offset-canvas"

// Button Styles
export const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold ring-offset-canvas transition-[transform,background-color,border-color,color,box-shadow] duration-200 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border border-ink bg-ink text-white shadow-[3px_3px_0_var(--accent)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--accent)] dark:border-acid dark:bg-acid dark:text-acid-ink",
                destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
                outline:
                    "border border-line bg-surface-strong text-ink hover:border-ink hover:bg-surface dark:text-white dark:hover:border-acid",
                secondary:
                    "bg-stone-200 text-ink hover:bg-stone-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
                ghost: "text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10",
                link: "text-ink underline-offset-4 hover:underline dark:text-white",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

// Badge Styles
export const badgeStyles = {
    base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
    variants: {
        default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
        outline: "text-slate-950",
        success: "border-transparent bg-emerald-600 text-white hover:bg-emerald-600/80",
    }
}

// Card Styles
export const cardStyles = {
    root: "rounded-md border border-line bg-surface text-ink shadow-[0_12px_32px_color-mix(in_srgb,var(--foreground)_6%,transparent)] dark:text-white",
    header: "flex flex-col space-y-1.5 p-6",
    title: "text-2xl font-semibold leading-none tracking-tight",
    content: "p-6 pt-0",
}

// Header Styles
export const headerStyles = {
    wrapper: "border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-50",
    container: "container mx-auto px-4 h-16 flex items-center justify-between",
    logo: "text-xl font-bold tracking-tight text-slate-900 dark:text-white",
    nav: "flex items-center gap-6",
    link: "text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
}

// Page Layout Styles
export const pageStyles = {
    wrapper: "app-shell font-sans text-ink dark:text-white",
    container: "mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8",
    section: "mb-12",
    sectionHeader: "mb-5 flex items-end justify-between border-b border-ink/10 pb-3 dark:border-white/10",
    sectionTitle: "font-display text-3xl font-bold uppercase tracking-tight text-ink dark:text-white",
    pageTitle: "font-display mb-8 text-5xl font-bold uppercase leading-none tracking-tight text-ink dark:text-white",
    countBadge: "min-w-8 border border-ink/15 bg-acid px-2.5 py-1 text-center font-display text-sm font-bold text-acid-ink dark:border-acid/40",
    emptyState: "court-lines border border-dashed border-line bg-surface px-4 py-14 text-center text-sm text-muted",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
}

// KPI Card Styles
export const kpiStyles = {
    card: "sport-panel",
    header: "flex flex-row items-center justify-between space-y-0 pb-2",
    title: "eyebrow text-muted",
    value: "metric-number font-display text-5xl font-bold leading-none text-ink dark:text-white",
    subtext: "mt-2 text-xs text-muted",
    icon: {
        emerald: "h-4 w-4 text-emerald-600 dark:text-emerald-400",
        blue: "h-4 w-4 text-blue-600 dark:text-blue-400",
        orange: "h-4 w-4 text-orange-600 dark:text-orange-400"
    }
}
