import { cva } from "class-variance-authority"

// Input Styles
export const inputStyles = "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-50 dark:placeholder:text-slate-400 dark:ring-offset-slate-950"

// Button Styles
export const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
                destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
                outline:
                    "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                secondary:
                    "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
                ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
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
    root: "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50",
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
    wrapper: "min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50",
    container: "container mx-auto px-4 py-8 max-w-5xl",
    section: "mb-12",
    sectionHeader: "flex items-center justify-between mb-6",
    sectionTitle: "text-2xl font-bold text-slate-900 dark:text-white",
    pageTitle: "text-3xl font-bold text-slate-900 mb-8 dark:text-white",
    countBadge: "bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-medium dark:bg-slate-800 dark:text-slate-300",
    emptyState: "text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
}

// KPI Card Styles
export const kpiStyles = {
    card: "dark:bg-slate-800 dark:border-slate-700",
    header: "flex flex-row items-center justify-between space-y-0 pb-2",
    title: "text-sm font-medium text-slate-500 dark:text-slate-400",
    value: "text-2xl font-bold dark:text-white",
    subtext: "text-xs text-slate-500 dark:text-slate-400",
    icon: {
        emerald: "h-4 w-4 text-emerald-600 dark:text-emerald-400",
        blue: "h-4 w-4 text-blue-600 dark:text-blue-400",
        orange: "h-4 w-4 text-orange-600 dark:text-orange-400"
    }
}
