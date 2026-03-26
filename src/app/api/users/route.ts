import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { z } from 'zod'
import type { Role, User } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    const db = await connectToDatabase()
    const usersCollection = db.collection<User>('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: validated.email.toLowerCase()
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const requestedRole = (validated.role || 'viewer').trim().toLowerCase()
    const canManageUsers = !!(await getServerSession(authOptions))?.user.permissions?.includes('manage_users')

    // Public registration can only create viewer accounts.
    if (!canManageUsers && requestedRole !== 'viewer') {
      return NextResponse.json(
        { error: 'You are not allowed to create this role' },
        { status: 403 }
      )
    }

    const rolesCollection = db.collection<Role>('roles')
    const roleExists =
      ['admin', 'editor', 'viewer'].includes(requestedRole) ||
      !!(await rolesCollection.findOne({ name: requestedRole }))

    if (!roleExists) {
      return NextResponse.json(
        { error: 'Selected role does not exist' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12)

    const newUser: Omit<User, '_id'> = {
      name: validated.name,
      email: validated.email.toLowerCase(),
      password: hashedPassword,
      role: requestedRole,
      isActive: typeof validated.isActive === 'boolean' ? validated.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser as User)

    return NextResponse.json({
      message: 'Registration successful',
      userId: result.insertedId.toString(),
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection<User>('users')

    const users = await usersCollection
      .find({}, { projection: { password: 0 } }) // Exclude password
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
