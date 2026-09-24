import { Header } from '@/components/header'
import { PageIntro } from '@/components/page-intro'
import { PricingSettingsForm } from '@/components/pricing-settings-form'
import { ProfileSettingsForm } from '@/components/profile-settings-form'
import { requireRole } from '@/lib/auth'
import { pageStyles } from '@/lib/styles'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const { username, email, laborPrice } = await requireRole('stringer')

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
                </div>
            </main>
        </div>
    )
}
