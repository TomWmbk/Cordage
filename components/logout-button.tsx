'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from './button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.replace('/login?role=stringer')
        router.refresh()
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-10 w-10 rounded-sm border border-line bg-surface-strong hover:border-red-500"
            title="Se déconnecter"
            aria-label="Se déconnecter"
        >
            <LogOut className="h-[1.1rem] w-[1.1rem] text-red-600 dark:text-red-400" />
        </Button>
    )
}
