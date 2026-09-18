import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const { username, password, role } = await request.json()

        // Validation
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Nom d\'utilisateur et mot de passe requis' },
                { status: 400 }
            )
        }

        if (username.length < 3) {
            return NextResponse.json(
                { error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            )
        }

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
        const hashedPassword = await bcrypt.hash(password, 10)

        // Créer l'utilisateur
        const user = await db.user.create({
            data: {
                username,
                password: hashedPassword,
                role: role || 'stringer'
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
