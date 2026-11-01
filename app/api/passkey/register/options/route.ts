import { generateRegistrationOptions } from '@simplewebauthn/server'
import { cookies } from 'next/headers'

import { getCurrentUser } from '@/lib/auth'
import { rpID, rpName, signChallenge } from '@/lib/passkey'

export async function POST() {
    // 1. On récupère l'utilisateur déjà connecté
    const user = await getCurrentUser()

    // 2. SimpleWebAuthn génère les options + un nouveau challenge
    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userName: user.username,

        authenticatorSelection: {
            userVerification: 'required',
        },
    })

    // 3. On authentifie notre challenge avec notre secret serveur
    const challengeHmac = signChallenge(options.challenge)

    // 4. On récupère l'interface permettant d'écrire les cookies
    const cookieStore = await cookies()

    // 5. On stocke temporairement challenge + HMAC côté navigateur
    cookieStore.set(
        'passkey_registration_challenge',
        `${options.challenge}.${challengeHmac}`,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 300,
            path: '/',
        }
    )

    // 6. On donne les options WebAuthn au frontend
    return Response.json(options)
}