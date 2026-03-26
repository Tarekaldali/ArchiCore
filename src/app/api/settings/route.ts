import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch settings
export async function GET() {
  try {
    const db = await connectToDatabase()

    const settings = await db.collection('settings').findOne({ key: 'site' })

    return NextResponse.json({
      settings: settings?.value || {
        siteName: 'ArchiCore',
        siteDescription: 'Architecture Portfolio',
        contactEmail: 'hello@archicore.com',
        contactPhone: '+1 (234) 567-890',
        address: '123 Architecture Avenue, New York, NY 10001',
        socialLinks: {
          instagram: '',
          linkedin: '',
          twitter: ''
        }
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const db = await connectToDatabase()

    await db.collection('settings').updateOne(
      { key: 'site' },
      {
        $set: {
          key: 'site',
          value: body,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
