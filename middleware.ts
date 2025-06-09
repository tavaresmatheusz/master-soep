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

    if (!check && !url.includes("login"))
        return NextResponse.redirect(new URL('/login', request.url))


    return response
}
