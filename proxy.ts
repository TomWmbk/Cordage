import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { destinationForRole } from '@/lib/domain'

const stringerPaths = ['/dashboard', '/stock', '/stats']

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    })

    const isStringerPath = stringerPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
    const isPlayerPath = pathname === '/player' || pathname.startsWith('/player/')
    const isProtectedPath = isStringerPath || isPlayerPath

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
        const destination = destinationForRole(token.role)
        if (destination !== '/login') {
            return NextResponse.redirect(new URL(destination, request.url))
        }
    }

    if (token?.role === 'player' && isStringerPath) {
        return NextResponse.redirect(new URL('/player/home', request.url))
    }

    if (token?.role === 'stringer' && isPlayerPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/stock/:path*', '/stats/:path*', '/player/:path*', '/login', '/register'],
}
