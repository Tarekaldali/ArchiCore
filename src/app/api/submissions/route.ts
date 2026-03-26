import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { projectInterestSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const projectSlug = searchParams.get('projectSlug')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const db = await connectToDatabase()
    const query: Record<string, unknown> = {}

    if (status && status !== 'all') {
      query.status = status
    }
    if (projectSlug) {
      query.projectSlug = projectSlug
    }

    const [submissions, total] = await Promise.all([
      db.collection('submissions')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      db.collection('submissions').countDocuments(query),
    ])

    return NextResponse.json({
      submissions,
      total,
      hasMore: offset + submissions.length < total,
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = projectInterestSchema.parse(body)

    const db = await connectToDatabase()
    const now = new Date()
    const result = await db.collection('submissions').insertOne({
      ...validated,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { id: result.insertedId, message: 'Submission sent successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating submission:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to submit interest' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body as { id?: string; status?: string }

    if (!id || !status) {
      return NextResponse.json({ error: 'Submission id and status are required' }, { status: 400 })
    }
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection('submissions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Submission updated successfully' })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Valid submission id is required' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection('submissions').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting submission:', error)
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}
