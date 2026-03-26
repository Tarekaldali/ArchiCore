import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from './mongodb'
import type { Permission, Role, User, UserRole } from '@/types'
import { normalizePermissions, permissionsForRole } from './rbac'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      permissions: Permission[]
      image?: string
    }
  }
  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    permissions: Permission[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    permissions: Permission[]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password')
        }

        try {
          const db = await connectToDatabase()
          const usersCollection = db.collection<User>('users')
          const rolesCollection = db.collection<Role>('roles')

          const user = await usersCollection.findOne({
            email: credentials.email.toLowerCase()
          })

          if (!user) {
            throw new Error('Invalid credentials')
          }

          if (!user.isActive) {
            throw new Error('Account is disabled')
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValidPassword) {
            throw new Error('Invalid credentials')
          }

          const roleRecord = await rolesCollection.findOne({ name: user.role })
          const rolePermissions = roleRecord?.permissions || permissionsForRole(user.role)
          const permissions = normalizePermissions(rolePermissions, user.permissions || [])

          return {
            id: user._id!.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            permissions,
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error
          }
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
      }
      if (!token.permissions) {
        token.permissions = permissionsForRole(token.role as UserRole)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role as UserRole
        session.user.permissions = Array.isArray(token.permissions)
          ? token.permissions as Permission[]
          : permissionsForRole(token.role as UserRole)
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export function checkPermission(
  role: UserRole,
  permission: Permission,
  directPermissions: Permission[] = []
): boolean {
  const mergedPermissions = normalizePermissions(permissionsForRole(role), directPermissions)
  return mergedPermissions.includes(permission)
}
