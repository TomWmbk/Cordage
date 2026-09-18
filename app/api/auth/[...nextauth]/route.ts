import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { isUserRole } from "@/lib/domain"

export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const user = await db.user.findUnique({
                    where: { username: credentials.username.trim().toLowerCase() }
                })

                if (!user) {
                    return null
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isValidPassword) {
                    return null
                }

                if (!isUserRole(user.role)) return null

                return {
                    id: user.id.toString(),
                    name: user.username,
                    role: user.role,
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
