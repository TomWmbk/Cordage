import { Header } from '@/components/header'
import { StockManager } from '@/components/stock-manager'
import { getStringReferences } from '@/app/stock/actions'
import { pageStyles } from '@/lib/styles'
import { requireRole } from '@/lib/auth'
import { PageIntro } from '@/components/page-intro'

export default async function StockPage() {
    await requireRole('stringer')
    const strings = await getStringReferences()

    return (
        <div className={pageStyles.wrapper}>
            <Header />
            <main className={pageStyles.container}>
                <PageIntro eyebrow="Inventaire atelier" title="Mur de bobines" description="Gardez vos références, jauges et tarifs prêts pour la prochaine pose." />

                <StockManager initialStrings={strings} />
            </main>
        </div>
    )
}
