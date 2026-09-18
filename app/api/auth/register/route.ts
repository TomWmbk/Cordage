import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { parseRegistrationInput } from '@/lib/domain'

export async function POST(request: Request) {
    try {
        const contentLength = Number(request.headers.get('content-length') || 0)
        if (contentLength > 4_096) {
            return NextResponse.json({ error: 'Requête trop volumineuse' }, { status: 413 })
        }

        const parsed = parseRegistrationInput(await request.json())
        if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
        const { username, password, role } = parsed.data

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db.user.findUnique({
            where: { username }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Ce nom d\'utilisateur est déjà utilisé' },
                { status: 409 }
            )
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12)

        // Créer l'utilisateur
        const user = await db.user.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Compte créé avec succès',
                userId: user.id
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la création du compte' },
            { status: 500 }
        )
    }
}
