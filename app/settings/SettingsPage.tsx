import { Header } from '@/components/header'
import { PageIntro } from '@/components/page-intro'
import { PricingSettingsForm } from '@/components/pricing-settings-form'
import { requireRole } from '@/lib/auth'
import { pageStyles } from '@/lib/styles'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const { laborPrice } = await requireRole('stringer')

    return (
        <div className={pageStyles.wrapper}>
            <Header />
            <main className={pageStyles.container}>
                <PageIntro
                    eyebrow="Réglages atelier"
                    title="Paramètres"
                    description="Définissez votre prix de main-d’œuvre. Il sera ajouté au prix du cordage pour chaque nouvelle pose."
                />
                <PricingSettingsForm laborPrice={laborPrice} />
            </main>
        </div>
    )
}
