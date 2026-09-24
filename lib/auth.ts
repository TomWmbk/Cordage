import { getServerSession } from "next-auth/next"
import { authOptions } from "../app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { destinationForRole, type UserRole } from "@/lib/domain"

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getCurrentUserId(): Promise<number> {
    return (await getCurrentUser()).id
}

export async function getCurrentUser() {
    const session = await getSession()
    const userId = Number(session?.user?.id)

    if (!Number.isSafeInteger(userId) || userId <= 0) {
        redirect('/login')
    }

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, role: true, laborPrice: true },
    })

    if (!user) redirect('/login')
    return user
}

export async function requireRole(role: UserRole) {
    const user = await getCurrentUser()

    if (user.role !== role) {
        redirect(destinationForRole(user.role))
    }

    return user
}
