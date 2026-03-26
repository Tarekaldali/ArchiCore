import { MongoClient } from 'mongodb'
import { seedProjects } from '../src/data/seed-projects'
import { seedTeam } from '../src/data/seed-team'
import fs from 'node:fs'
import path from 'node:path'

function loadEnvFromDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return

  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

function resolveDatabaseName(uri: string): string {
  try {
    const parsed = new URL(uri)
    const fromPath = parsed.pathname.replace(/^\//, '').trim()
    return fromPath || 'archicore'
  } catch {
    return 'archicore'
  }
}

type ServiceSeed = {
  title: string
  slug: string
  summary: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

const servicesSeed: ServiceSeed[] = [
  {
    title: 'Architectural Design',
    slug: 'architectural-design',
    summary: 'Concept-to-completion architecture for residential and commercial projects.',
    description: 'We deliver end-to-end architectural design including concept development, design documentation, and authority approvals.',
    icon: 'building-2',
    order: 1,
    isActive: true,
  },
  {
    title: 'Interior Design',
    slug: 'interior-design',
    summary: 'Functional and aesthetic interior spaces tailored to your goals.',
    description: 'Our interior team handles space planning, material selection, lighting concepts, and furniture coordination.',
    icon: 'sofa',
    order: 2,
    isActive: true,
  },
  {
    title: 'Urban Planning',
    slug: 'urban-planning',
    summary: 'Masterplanning and urban strategies for long-term community impact.',
    description: 'We create urban frameworks focused on mobility, sustainability, and mixed-use livability.',
    icon: 'map',
    order: 3,
    isActive: true,
  },
]

type PublishStatus = 'draft' | 'published'

type ArticleSeed = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: {
    url: string
    publicId: string
    alt: string
  }
  status: PublishStatus
  author: string
  tags: string[]
}

const blogsSeed: ArticleSeed[] = [
  {
    title: 'How We Approach Sustainable Architecture',
    slug: 'sustainable-architecture-approach',
    excerpt: 'A practical look at our sustainability process from early concept to material selection.',
    content: 'At ArchiCore, sustainability starts on day one. We analyze orientation, passive cooling, and local materials before form-making decisions are finalized.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
      publicId: 'blog-sustainable-architecture',
      alt: 'Sustainable building facade detail',
    },
    status: 'published',
    author: 'ArchiCore Team',
    tags: ['sustainability', 'architecture', 'design-process'],
  },
]

const newsSeed: ArticleSeed[] = [
  {
    title: 'ArchiCore Wins Regional Design Award',
    slug: 'archicore-regional-design-award',
    excerpt: 'Our mixed-use tower project was recognized for innovation and environmental performance.',
    content: 'The jury highlighted our team\'s integration of passive design principles and thoughtful public space planning.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1200&q=80',
      publicId: 'news-design-award',
      alt: 'Architecture award event stage',
    },
    status: 'published',
    author: 'ArchiCore Press',
    tags: ['news', 'award', 'project'],
  },
]

const defaultSettings = {
  siteName: 'ArchiCore',
  siteDescription: 'Architecture Portfolio',
  contactEmail: 'hello@archicore.com',
  contactPhone: '+1 (234) 567-890',
  address: '123 Architecture Avenue, New York, NY 10001',
  socialLinks: {
    instagram: '',
    linkedin: '',
    twitter: '',
  },
}

const defaultContent = {
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

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag)
}

async function seed() {
  loadEnvFromDotEnv()

  const mongodbUri = process.env.MONGODB_URI
  if (!mongodbUri) {
    console.error('ERROR: MONGODB_URI is not set in environment or .env file.')
    process.exit(1)
  }

  const keepExisting = hasFlag('--keep-existing')
  const dbName = resolveDatabaseName(mongodbUri)

  console.log('Starting database seed...')
  console.log(`Mode: ${keepExisting ? 'keep-existing' : 'reset-and-seed'}`)
  console.log(`Database: ${dbName}`)

  const client = new MongoClient(mongodbUri)

  try {
    await client.connect()
    const db = client.db(dbName)

    if (!keepExisting) {
      console.log('Clearing existing seed-managed collections...')
      await Promise.all([
        db.collection('projects').deleteMany({}),
        db.collection('team').deleteMany({}),
        db.collection('services').deleteMany({}),
        db.collection('blogs').deleteMany({}),
        db.collection('news').deleteMany({}),
        db.collection('content').deleteMany({ key: { $in: ['home', 'about'] } }),
        db.collection('settings').deleteMany({ key: 'site' }),
      ])
    }

    const now = new Date()

    await db.collection('projects').insertMany(
      seedProjects.map((project) => ({ ...project, createdAt: now, updatedAt: now }))
    )

    await db.collection('team').insertMany(
      seedTeam.map((member) => ({ ...member, createdAt: now, updatedAt: now }))
    )

    await db.collection('services').insertMany(
      servicesSeed.map((service) => ({ ...service, createdAt: now, updatedAt: now }))
    )

    await db.collection('blogs').insertMany(
      blogsSeed.map((blog) => ({
        ...blog,
        publishedAt: blog.status === 'published' ? now : undefined,
        createdAt: now,
        updatedAt: now,
      }))
    )

    await db.collection('news').insertMany(
      newsSeed.map((article) => ({
        ...article,
        publishedAt: article.status === 'published' ? now : undefined,
        createdAt: now,
        updatedAt: now,
      }))
    )

    await db.collection('settings').updateOne(
      { key: 'site' },
      {
        $set: {
          key: 'site',
          value: defaultSettings,
          updatedAt: now,
        },
      },
      { upsert: true }
    )

    await db.collection('content').updateOne(
      { key: 'home' },
      {
        $set: {
          key: 'home',
          value: defaultContent.home,
          updatedAt: now,
        },
      },
      { upsert: true }
    )

    await db.collection('content').updateOne(
      { key: 'about' },
      {
        $set: {
          key: 'about',
          value: defaultContent.about,
          updatedAt: now,
        },
      },
      { upsert: true }
    )

    await Promise.all([
      db.collection('projects').createIndex({ slug: 1 }, { unique: true }),
      db.collection('projects').createIndex({ category: 1 }),
      db.collection('projects').createIndex({ featured: 1, status: 1 }),
      db.collection('projects').createIndex({ tags: 1 }),
      db.collection('team').createIndex({ order: 1, isActive: 1 }),
      db.collection('services').createIndex({ slug: 1 }, { unique: true }),
      db.collection('services').createIndex({ order: 1, isActive: 1 }),
      db.collection('blogs').createIndex({ slug: 1 }, { unique: true }),
      db.collection('blogs').createIndex({ status: 1, publishedAt: -1 }),
      db.collection('news').createIndex({ slug: 1 }, { unique: true }),
      db.collection('news').createIndex({ status: 1, publishedAt: -1 }),
      db.collection('content').createIndex({ key: 1 }, { unique: true }),
      db.collection('settings').createIndex({ key: 1 }, { unique: true }),
    ])

    console.log('Database seeded successfully.')
    console.log(`Inserted ${seedProjects.length} projects`)
    console.log(`Inserted ${seedTeam.length} team members`)
    console.log(`Inserted ${servicesSeed.length} services`)
    console.log(`Inserted ${blogsSeed.length} blog posts`)
    console.log(`Inserted ${newsSeed.length} news items`)
    console.log('Upserted home/about content and site settings')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

void seed()
