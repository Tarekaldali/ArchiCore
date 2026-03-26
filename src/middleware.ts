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
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Allow admin and editor roles to access admin panel
    if (token.role !== 'admin' && token.role !== 'editor') {
      // Redirect non-admin/editor users to homepage with error message
      const homeUrl = new URL('/', request.url)
      homeUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(homeUrl)
    }
  }

  // Protect admin API routes (POST, PUT, DELETE, PATCH require appropriate role)
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

      // Admin can do everything
      if (token.role === 'admin') {
        return NextResponse.next()
      }

      // Editor can create and update projects and messages, but not delete
      if (token.role === 'editor') {
        // Editors cannot access users, team, or settings endpoints
        if (pathname.startsWith('/api/users') ||
            pathname.startsWith('/api/team') ||
            pathname.startsWith('/api/settings')) {
          return NextResponse.json(
            { error: 'Forbidden - Admin access required' },
            { status: 403 }
          )
        }

        // Editors cannot delete
        if (method === 'DELETE') {
          return NextResponse.json(
            { error: 'Forbidden - Admin access required for delete operations' },
            { status: 403 }
          )
        }

        // Allow editor to create/update projects and messages
        return NextResponse.next()
      }

      // Viewers and others cannot modify
      return NextResponse.json(
        { error: 'Forbidden - Admin or Editor access required' },
        { status: 403 }
      )
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
