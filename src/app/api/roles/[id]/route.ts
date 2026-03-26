import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { roleSchema } from '@/lib/validations'
import { z } from 'zod'
import type { Role } from '@/types'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid role id' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const role = await db.collection<Role>('roles').findOne({ _id: new ObjectId(id) })

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json({ role })
  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid role id' }, { status: 400 })
    }

    const body = await request.json()
    const validated = roleSchema.parse(body)
    const roleName = validated.name.trim().toLowerCase()

    const db = await connectToDatabase()
    const rolesCollection = db.collection<Role>('roles')
    const existing = await rolesCollection.findOne({ _id: new ObjectId(id) })

    if (!existing) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    const duplicate = await rolesCollection.findOne({
      name: roleName,
      _id: { $ne: new ObjectId(id) },
    })
    if (duplicate) {
      return NextResponse.json({ error: 'Role name already exists' }, { status: 400 })
    }

    await rolesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: roleName,
          permissions: validated.permissions,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ message: 'Role updated successfully' })
  } catch (error) {
    console.error('Error updating role:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid role id' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const rolesCollection = db.collection<Role>('roles')
    const role = await rolesCollection.findOne({ _id: new ObjectId(id) })

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    if (['admin', 'editor', 'viewer'].includes(role.name)) {
      return NextResponse.json(
        { error: 'Default roles cannot be deleted' },
        { status: 400 }
      )
    }

    const usersUsingRole = await db.collection('users').countDocuments({ role: role.name })
    if (usersUsingRole > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role assigned to users' },
        { status: 400 }
      )
    }

    await rolesCollection.deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 })
  }
}
