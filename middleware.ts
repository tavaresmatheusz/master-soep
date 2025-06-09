import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkLogin } from './lib/actions'

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl.href
    const response = NextResponse.next()

    if (url.includes('dashboard')) {
        console.log("Checking dashboard access...");
        const hasToken = await checkLogin()
        console.log("Dashboard access check result:", hasToken);
        return hasToken ? response : NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
