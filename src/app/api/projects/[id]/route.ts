import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { projectSchema } from '@/lib/validations'
import { deleteImage } from '@/lib/cloudinary'
import { z } from 'zod'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const db = await connectToDatabase()

    let project
    // Try to find by slug first, then by ObjectId
    project = await db.collection('projects').findOne({ slug: id })

    if (!project && ObjectId.isValid(id)) {
      project = await db.collection('projects').findOne({ _id: new ObjectId(id) })
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const body = await request.json()
    const validated = projectSchema.partial().parse(body)

    const db = await connectToDatabase()

    // Check if project exists
    const existing = await db.collection('projects').findOne({
      _id: new ObjectId(id)
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check slug uniqueness if slug is being updated
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await db.collection('projects').findOne({ slug: validated.slug })
      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...validated,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('Error updating project:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const db = await connectToDatabase()

    // Get project to delete associated images
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(id)
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary
    if (project.images && project.images.length > 0) {
      const deletePromises = project.images
        .filter((img: { publicId?: string }) => img.publicId)
        .map((img: { publicId: string }) => deleteImage(img.publicId))

      await Promise.allSettled(deletePromises)
    }

    // Delete project from database
    const result = await db.collection('projects').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
