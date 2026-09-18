import { getServerSession } from "next-auth/next"
import { authOptions } from "../app/api/auth/[...nextauth]/route"

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getCurrentUserId(): Promise<number> {
    const session = await getSession()

    if (!session?.user?.id) {
        throw new Error('Non authentifié')
    }

    return parseInt(session.user.id)
}
