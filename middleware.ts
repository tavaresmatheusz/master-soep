import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkLogin } from './lib/actions'

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl.href

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || null

    const response = NextResponse.next()
    const check = await checkLogin();

    if (!request.cookies.get('client-ip') && ip) {
        response.cookies.set('client-ip', ip, {
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
        })
    }

    if (!check)
        return NextResponse.redirect(new URL('/login', request.url))

    // if (url.includes('login')) {
    //     const hasToken = await checkLogin
    //     return hasToken ? NextResponse.redirect(new URL('/projects', request.url)) : response
    // }

    // if (url.includes('dashboard')) {
    //     const hasToken = await checkLogin()
    //     return hasToken ? response : NextResponse.redirect(new URL('/login', request.url))
    // }

    return response
}
