import { Header } from '@/components/header'
import { PageIntro } from '@/components/page-intro'
import { PricingSettingsForm } from '@/components/pricing-settings-form'
import { ProfileSettingsForm } from '@/components/profile-settings-form'
import { requireRole } from '@/lib/auth'
import { pageStyles } from '@/lib/styles'
import { getRacketBrands } from '@/lib/racket-brands'
import { RacketBrandSettings } from '@/components/racket-brand-settings'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const { id, username, email, laborPrice } = await requireRole('stringer')
    const brands = await getRacketBrands(id)

    return (
        <div className={pageStyles.wrapper}>
            <Header />
            <main className={pageStyles.container}>
                <PageIntro
                    eyebrow="Réglages atelier"
                    title="Paramètres"
                    description="Gérez votre identité d’atelier et votre prix de main-d’œuvre au même endroit."
                />
                <div className="grid items-start gap-6 lg:grid-cols-2">
                    <ProfileSettingsForm username={username} email={email ?? ''} />
                    <PricingSettingsForm laborPrice={laborPrice} />
                    <RacketBrandSettings brands={brands} />
                </div>
            </main>
        </div>
    )
}
