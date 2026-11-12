'use client'

import { useSyncExternalStore, type FormEventHandler, type ReactNode } from 'react'

const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

// Native GET submission would put credentials into the address bar before hydration.
export function CredentialForm({ children, onSubmit }: { children: ReactNode; onSubmit: FormEventHandler<HTMLFormElement> }) {
    const ready = useSyncExternalStore(subscribe, clientReady, serverReady)
    return <form method="post" onSubmit={onSubmit}>
        <fieldset disabled={!ready} className="min-w-0 space-y-5 border-0 p-0 m-0">
            {children}
        </fieldset>
        <noscript><p role="alert">JavaScript est nécessaire pour vous connecter. Activez-le puis rechargez cette page.</p></noscript>
    </form>
}
