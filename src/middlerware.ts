import exp from "constants";
import { NextRequest, NextResponse } from "next/server";
export { default } from 'next-auth/middleware';
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });
    const url = request.nextUrl

    if (token &&
        (url.pathname.startsWith('/auth/signin') ||
            url.pathname.startsWith('/auth/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/dashboard') ||
            url.pathname.startsWith('/'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/signin', request.url))

    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/auth/signin',
        '/auth/signup',
        '/dashboard/:path*',
        '/verify/:path*',
        '/'
    ],
}