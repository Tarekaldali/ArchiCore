import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from './mongodb'
import type { User, UserRole } from '@/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      image?: string
    }
  }
  interface User {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
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

          // Find user by email
          const user = await usersCollection.findOne({
            email: credentials.email.toLowerCase()
          })

          if (!user) {
            throw new Error('Invalid credentials')
          }

          if (!user.isActive) {
            throw new Error('Account is disabled')
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValidPassword) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user._id!.toString(),
            email: user.email,
            name: user.name,
            role: user.role
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
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to check if user has permission
export function checkPermission(role: UserRole, permission: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    admin: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_team'],
    editor: ['create', 'read', 'update'],
    viewer: ['read'],
  }
  return permissions[role]?.includes(permission) || false
}
