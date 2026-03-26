import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    // Not logged in - redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // CRITICAL: Check if user has admin role
    // Only admin role can access the admin panel
    if (token.role !== 'admin') {
      // Redirect non-admin users to homepage with error message
      const homeUrl = new URL('/', request.url)
      homeUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(homeUrl)
    }
  }

  // Protect admin API routes (POST, PUT, DELETE, PATCH require admin)
  if (pathname.startsWith('/api/') &&
      !pathname.startsWith('/api/auth') &&
      !pathname.startsWith('/api/contact')) {
    const method = request.method

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      })

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized - Please login' },
          { status: 401 }
        )
      }

      // Only admin can modify data
      if (token.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/projects/:path*',
    '/api/team/:path*',
    '/api/messages/:path*',
    '/api/users/:path*',
    '/api/settings/:path*'
  ]
}
