'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from './button'

export function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800"
            title="Se déconnecter"
            aria-label="Se déconnecter"
        >
            <LogOut className="h-[1.2rem] w-[1.2rem] text-red-500 dark:text-red-400" />
        </Button>
    )
}
