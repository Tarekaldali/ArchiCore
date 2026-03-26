import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { Permission, UserRole } from '@/types'
import { permissionsForRole } from '@/lib/rbac'

type ApiRule = {
  prefix: string
  readPermission?: Permission
  writePermission?: Permission
  writeAnyOf?: Permission[]
}

const ADMIN_ROUTE_RULES: Array<{ prefix: string; permission: Permission }> = [
  { prefix: '/admin/projects', permission: 'manage_projects' },
  { prefix: '/admin/team', permission: 'manage_team' },
  { prefix: '/admin/messages', permission: 'view_messages' },
  { prefix: '/admin/submissions', permission: 'view_submissions' },
  { prefix: '/admin/users', permission: 'manage_users' },
  { prefix: '/admin/roles', permission: 'manage_roles' },
  { prefix: '/admin/settings', permission: 'manage_settings' },
  { prefix: '/admin/blogs', permission: 'manage_blogs' },
  { prefix: '/admin/news', permission: 'manage_news' },
  { prefix: '/admin/services', permission: 'manage_services' },
  { prefix: '/admin/content', permission: 'manage_content' },
]

const API_RULES: ApiRule[] = [
  { prefix: '/api/projects', writePermission: 'manage_projects' },
  { prefix: '/api/team', writePermission: 'manage_team' },
  { prefix: '/api/messages', readPermission: 'view_messages', writePermission: 'view_messages' },
  { prefix: '/api/submissions', readPermission: 'view_submissions', writePermission: 'view_submissions' },
  { prefix: '/api/users', readPermission: 'manage_users', writePermission: 'manage_users' },
  { prefix: '/api/settings', writePermission: 'manage_settings' },
  { prefix: '/api/roles', readPermission: 'manage_users', writePermission: 'manage_roles' },
  { prefix: '/api/blogs', writePermission: 'manage_blogs' },
  { prefix: '/api/news', writePermission: 'manage_news' },
  { prefix: '/api/services', writePermission: 'manage_services' },
  { prefix: '/api/content', writePermission: 'manage_content' },
  {
    prefix: '/api/upload',
    writeAnyOf: ['manage_projects', 'manage_team', 'manage_blogs', 'manage_news', 'manage_services', 'manage_content'],
  },
]

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

function getTokenPermissions(token: Awaited<ReturnType<typeof getToken>>): Permission[] {
  if (!token || typeof token === 'string') return []

  if (Array.isArray(token.permissions)) {
    return token.permissions as Permission[]
  }

  const role = token.role as UserRole | undefined
  return role ? permissionsForRole(role) : []
}

function getAdminRoutePermission(pathname: string): Permission {
  const match = ADMIN_ROUTE_RULES.find((rule) => pathname.startsWith(rule.prefix))
  return match?.permission || 'view_dashboard'
}

function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean {
  return permissions.some((permission) => userPermissions.includes(permission))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const permissions = getTokenPermissions(token)
    const requiredPermission = getAdminRoutePermission(pathname)

    if (!permissions.includes(requiredPermission)) {
      const homeUrl = new URL('/', request.url)
      homeUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(homeUrl)
    }
  }

  // API protection (permission-based)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    if (pathname.startsWith('/api/contact')) {
      return NextResponse.next()
    }

    // Public project-interest submission endpoint
    if (pathname.startsWith('/api/submissions') && request.method === 'POST') {
      return NextResponse.next()
    }

    // Public registration endpoint
    if (pathname === '/api/users' && request.method === 'POST') {
      return NextResponse.next()
    }

    const rule = API_RULES.find((entry) => pathname.startsWith(entry.prefix))
    if (!rule) {
      return NextResponse.next()
    }

    const method = request.method.toUpperCase()
    const isWrite = WRITE_METHODS.includes(method)
    const requiredPermission = isWrite ? rule.writePermission : rule.readPermission
    const requiredAnyOf = isWrite ? rule.writeAnyOf : undefined

    if (!requiredPermission && !requiredAnyOf) {
      return NextResponse.next()
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
    }

    const permissions = getTokenPermissions(token)
    const hasRequiredPermission = requiredPermission ? permissions.includes(requiredPermission) : true
    const hasRequiredAny = requiredAnyOf ? hasAnyPermission(permissions, requiredAnyOf) : true

    if (!hasRequiredPermission || !hasRequiredAny) {
      return NextResponse.json(
        { error: 'Forbidden - Missing required permission' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ]
}
