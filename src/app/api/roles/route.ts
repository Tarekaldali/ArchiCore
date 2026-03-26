import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { roleSchema } from '@/lib/validations'
import { z } from 'zod'
import type { Role } from '@/types'
import { DEFAULT_ROLES } from '@/lib/rbac'

export async function GET() {
  try {
    const db = await connectToDatabase()
    const rolesCollection = db.collection<Role>('roles')
    let roles = await rolesCollection.find({}).sort({ name: 1 }).toArray()

    if (roles.length === 0) {
      const now = new Date()
      await rolesCollection.insertMany(
        DEFAULT_ROLES.map((role) => ({
          ...role,
          createdAt: now,
          updatedAt: now,
        }))
      )
      roles = await rolesCollection.find({}).sort({ name: 1 }).toArray()
    }

    return NextResponse.json({ roles })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = roleSchema.parse(body)
    const roleName = validated.name.trim().toLowerCase()

    const db = await connectToDatabase()
    const exists = await db.collection<Role>('roles').findOne({ name: roleName })
    if (exists) {
      return NextResponse.json({ error: 'Role already exists' }, { status: 400 })
    }

    const now = new Date()
    const result = await db.collection<Role>('roles').insertOne({
      name: roleName,
      permissions: validated.permissions,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Role created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating role:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 })
  }
}
