import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const canUpload = session.user.permissions?.some((permission) =>
      ['manage_projects', 'manage_team', 'manage_blogs', 'manage_news', 'manage_services', 'manage_content'].includes(permission)
    )

    if (!canUpload) {
      return NextResponse.json(
        { error: 'Forbidden - Missing upload permission' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Store in MongoDB as base64 data URL, keep size conservative
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File must be less than 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`

    const db = await connectToDatabase()
    const mediaResult = await db.collection('media').insertOne({
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      dataUrl,
      createdBy: session.user.id,
      createdAt: new Date(),
    })

    return NextResponse.json({
      url: dataUrl,
      publicId: mediaResult.insertedId.toString(),
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const canDelete = session?.user.permissions?.some((permission) =>
      ['manage_projects', 'manage_team', 'manage_blogs', 'manage_news', 'manage_services', 'manage_content'].includes(permission)
    )

    if (!session || !canDelete) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    if (ObjectId.isValid(publicId)) {
      await db.collection('media').deleteOne({ _id: new ObjectId(publicId) })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
