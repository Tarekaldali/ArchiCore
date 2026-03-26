import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const contentUpdateSchema = z.object({
  key: z.enum(['home', 'about']),
  value: z.record(z.any()),
})

const DEFAULT_CONTENT = {
  home: {
    heroBadge: 'Award-Winning Architecture Studio',
    heroTitle: 'Designing Spaces That Inspire and Endure',
    heroSubtitle:
      'We create architectural masterpieces that blend innovation with timeless elegance, transforming visions into extraordinary living and working environments.',
    introTitle: 'Where Vision Meets Architectural Excellence',
    introText:
      'Founded in 2010, ArchiCore has established itself as a leading force in contemporary architecture.',
  },
  about: {
    heroTitle: "Crafting Tomorrow's Architecture Today",
    heroText:
      'Founded in 2010, ArchiCore has grown from a small studio into an internationally recognized architecture practice.',
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const db = await connectToDatabase()
    const collection = db.collection('content')

    if (key === 'home' || key === 'about') {
      const item = await collection.findOne({ key })
      return NextResponse.json({
        key,
        value: item?.value || DEFAULT_CONTENT[key],
      })
    }

    const items = await collection
      .find({ key: { $in: ['home', 'about'] } })
      .toArray()

    const home = items.find((item) => item.key === 'home')?.value || DEFAULT_CONTENT.home
    const about = items.find((item) => item.key === 'about')?.value || DEFAULT_CONTENT.about

    return NextResponse.json({ home, about })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contentUpdateSchema.parse(body)

    const db = await connectToDatabase()
    await db.collection('content').updateOne(
      { key: validated.key },
      {
        $set: {
          key: validated.key,
          value: validated.value,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ message: 'Content saved successfully' })
  } catch (error) {
    console.error('Error updating content:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
