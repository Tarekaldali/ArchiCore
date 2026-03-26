import type { Permission, UserRole } from '@/types'

const CORE_ADMIN_PERMISSIONS: Permission[] = [
  'view_dashboard',
  'manage_projects',
  'manage_users',
  'manage_settings',
  'manage_team',
  'view_messages',
  'view_submissions',
  'manage_roles',
  'manage_blogs',
  'manage_news',
  'manage_services',
  'manage_content',
]

export const DEFAULT_ROLE_PERMISSIONS: Record<'admin' | 'editor' | 'viewer', Permission[]> = {
  admin: CORE_ADMIN_PERMISSIONS,
  editor: [
    'view_dashboard',
    'manage_projects',
    'view_messages',
    'view_submissions',
    'manage_blogs',
    'manage_news',
    'manage_services',
    'manage_content',
  ],
  viewer: ['view_dashboard', 'view_messages', 'view_submissions'],
}

export const DEFAULT_ROLES = (Object.keys(DEFAULT_ROLE_PERMISSIONS) as Array<keyof typeof DEFAULT_ROLE_PERMISSIONS>).map((role) => ({
  name: role,
  permissions: DEFAULT_ROLE_PERMISSIONS[role],
}))

export function permissionsForRole(role: UserRole): Permission[] {
  if (role === 'admin' || role === 'editor' || role === 'viewer') {
    return DEFAULT_ROLE_PERMISSIONS[role]
  }
  return []
}

export function normalizePermissions(
  rolePermissions: Permission[] = [],
  directPermissions: Permission[] = []
): Permission[] {
  return Array.from(new Set([...rolePermissions, ...directPermissions]))
}

export function hasPermission(permissions: string[] | undefined, permission: Permission): boolean {
  if (!permissions?.length) return false
  return permissions.includes(permission)
}
