import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { destinationForRole } from '@/lib/domain'

const stringerPaths = ['/dashboard', '/stock', '/stats']

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const requestedRole = request.nextUrl.searchParams.get('role')
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    })

    const isStringerPath = stringerPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
    const isPlayerPath = pathname === '/player' || pathname.startsWith('/player/')
    const isProtectedPath = isStringerPath

    if (pathname === '/login' && requestedRole && requestedRole !== 'stringer') {
        return NextResponse.redirect(new URL('/login?role=stringer', request.url))
    }

    if (pathname === '/register' && requestedRole) {
        return NextResponse.redirect(new URL('/register', request.url))
    }

    if (isPlayerPath) {
        return NextResponse.redirect(new URL('/login?role=stringer', request.url))
    }

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL('/login?role=stringer', request.url))
    }

    if (token && token.role !== 'stringer' && (pathname === '/login' || pathname === '/register')) {
        const response = NextResponse.next()
        response.cookies.delete('next-auth.session-token')
        response.cookies.delete('__Secure-next-auth.session-token')
        return response
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
        const destination = destinationForRole(token.role)
        if (destination === '/dashboard') {
            return NextResponse.redirect(new URL(destination, request.url))
        }
    }

    if (token && token.role !== 'stringer' && isStringerPath) {
        return NextResponse.redirect(new URL('/login?role=stringer', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/stock/:path*', '/stats/:path*', '/player/:path*', '/login', '/register'],
}
