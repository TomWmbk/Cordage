import { Header } from '@/components/header'
import { StockManager } from '@/components/stock-manager'
import { getStringReferences } from '@/app/stock/actions'
import { pageStyles } from '@/lib/styles'
import { requireRole } from '@/lib/auth'

export default async function StockPage() {
    await requireRole('stringer')
    const strings = await getStringReferences()

    return (
        <div className={pageStyles.wrapper}>
            <Header />
            <main className={pageStyles.container}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-0">Mes Cordages</h1>
                </div>

                <StockManager initialStrings={strings} />
            </main>
        </div>
    )
}
