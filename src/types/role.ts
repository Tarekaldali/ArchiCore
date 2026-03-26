import type { ObjectId } from 'mongodb'

export const AVAILABLE_PERMISSIONS = [
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
] as const

export type Permission = (typeof AVAILABLE_PERMISSIONS)[number]

export interface Role {
  _id?: ObjectId
  name: string
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

export type RoleInput = Omit<Role, '_id' | 'createdAt' | 'updatedAt'>
