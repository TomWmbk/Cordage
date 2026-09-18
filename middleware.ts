import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the session cookie
    const sessionToken = request.cookies.get('next-auth.session-token') ||
        request.cookies.get('__Secure-next-auth.session-token')

    const isLoginPage = request.nextUrl.pathname === '/login'
    const isRegisterPage = request.nextUrl.pathname === '/register'
    const isLandingPage = request.nextUrl.pathname === '/'
    const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth')

    // Allow API auth routes and Landing Page
    if (isApiAuth || isLandingPage) {
        return NextResponse.next()
    }

    // If no session and not on public pages, redirect to login
    if (!sessionToken && !isLoginPage && !isRegisterPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If has session and on login/register page, redirect to dashboard (default)
    // Ideally we would redirect to the correct role page, but we can't easily decode the token here without external libs.
    // The client-side redirection in login page handles the initial flow.
    if (sessionToken && (isLoginPage || isRegisterPage)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
