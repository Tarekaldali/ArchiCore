import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import type { Permission, Role, User } from '@/types'

// GET - Get single user (exclude password)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection<User>('users')

    const user = await usersCollection.findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH - Update user (role, isActive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { role, isActive, permissions } = body as {
      role?: string
      isActive?: boolean
      permissions?: Permission[]
    }

    const db = await connectToDatabase()
    const usersCollection = db.collection<User>('users')
    const rolesCollection = db.collection<Role>('roles')

    const updateData: Partial<User> = {
      updatedAt: new Date(),
    }

    if (role) {
      const normalizedRole = role.trim().toLowerCase()
      const roleExists =
        ['admin', 'editor', 'viewer'].includes(normalizedRole) ||
        !!(await rolesCollection.findOne({ name: normalizedRole }))

      if (!roleExists) {
        return NextResponse.json(
          { error: 'Selected role does not exist' },
          { status: 400 }
        )
      }

      updateData.role = normalizedRole
    }

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive
    }

    if (Array.isArray(permissions)) {
      updateData.permissions = permissions
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection<User>('users')

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
