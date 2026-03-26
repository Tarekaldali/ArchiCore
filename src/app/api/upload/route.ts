import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = (formData.get('folder') as string) || 'archicore/projects'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      return uploadImage(buffer, folder)
    })

    const results = await Promise.all(uploadPromises)

    return NextResponse.json({
      images: results,
      message: 'Images uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { publicId } = body

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    await deleteImage(publicId)

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
