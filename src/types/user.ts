import type { ObjectId } from 'mongodb'
import { Permission } from './role'

export type UserRole = 'admin' | 'editor' | 'viewer' | string

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: UserRole
  permissions?: Permission[]
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
  permissions?: Permission[]
  image?: string
}
