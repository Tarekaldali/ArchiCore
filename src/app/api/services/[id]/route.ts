import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { serviceSchema } from '@/lib/validations'
import { z } from 'zod'

interface RouteContext {
  params: { id: string }
}

async function findServiceByParam(param: string) {
  const db = await connectToDatabase()
  let service = await db.collection('services').findOne({ slug: param })
  if (!service && ObjectId.isValid(param)) {
    service = await db.collection('services').findOne({ _id: new ObjectId(param) })
  }
  return { db, service }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const { service } = await findServiceByParam(id)

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const body = await request.json()
    const validated = serviceSchema.partial().parse(body)
    const { db, service } = await findServiceByParam(id)

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    if (validated.slug && validated.slug !== service.slug) {
      const slugExists = await db.collection('services').findOne({ slug: validated.slug })
      if (slugExists) {
        return NextResponse.json(
          { error: 'A service with this slug already exists' },
          { status: 400 }
        )
      }
    }

    await db.collection('services').updateOne(
      { _id: service._id },
      {
        $set: {
          ...validated,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ message: 'Service updated successfully' })
  } catch (error) {
    console.error('Error updating service:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const { db, service } = await findServiceByParam(id)

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await db.collection('services').deleteOne({ _id: service._id })
    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
