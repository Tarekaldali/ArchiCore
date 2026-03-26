import { ObjectId } from 'mongodb'

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: UserRole
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string
}

// Role permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canManageUsers: true,
    canManageTeam: true,
    canViewMessages: true,
    canAccessAdmin: true,
  },
  editor: {
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canManageUsers: false,
    canManageTeam: false,
    canViewMessages: true,
    canAccessAdmin: true,
  },
  viewer: {
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canManageUsers: false,
    canManageTeam: false,
    canViewMessages: true,
    canAccessAdmin: true,
  },
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS.admin

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}
