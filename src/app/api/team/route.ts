import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { teamMemberSchema } from '@/lib/validations'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

// GET - Fetch all team members
export async function GET() {
  try {
    const db = await connectToDatabase()

    const members = await db.collection('team')
      .find({})
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = teamMemberSchema.parse(body)

    const db = await connectToDatabase()

    const result = await db.collection('team').insertOne({
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Team member created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating team member:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}

// PUT - Update team member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()

    const result = await db.collection('team').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Team member updated successfully' })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE - Delete team member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()

    const result = await db.collection('team').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
