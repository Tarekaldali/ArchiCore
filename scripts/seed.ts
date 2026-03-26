import 'dotenv/config'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { seedProjects } from '../src/data/seed-projects'
import { seedTeam } from '../src/data/seed-team'
import { DEFAULT_ROLES } from '../src/lib/rbac'

const MONGODB_URI = process.env.MONGODB_URI

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set')
    console.log('Create a .env file with MONGODB_URI=<your connection string>')
    process.exit(1)
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI)
    const db = client.db('archicore')
    const now = new Date()

    await Promise.all([
      db.collection('projects').deleteMany({}),
      db.collection('team').deleteMany({}),
      db.collection('users').deleteMany({}),
      db.collection('contacts').deleteMany({}),
      db.collection('roles').deleteMany({}),
      db.collection('blogs').deleteMany({}),
      db.collection('news').deleteMany({}),
      db.collection('services').deleteMany({}),
      db.collection('submissions').deleteMany({}),
      db.collection('content').deleteMany({}),
      db.collection('media').deleteMany({}),
    ])

    await db.collection('roles').insertMany(
      DEFAULT_ROLES.map((role) => ({
        ...role,
        createdAt: now,
        updatedAt: now,
      }))
    )

    const adminPassword = await bcrypt.hash('Admin123!', 12)
    const editorPassword = await bcrypt.hash('Editor123!', 12)
    const viewerPassword = await bcrypt.hash('Viewer123!', 12)

    await db.collection('users').insertMany([
      {
        name: 'Admin',
        email: 'admin@archicore.com',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Editor',
        email: 'editor@archicore.com',
        password: editorPassword,
        role: 'editor',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Viewer',
        email: 'viewer@archicore.com',
        password: viewerPassword,
        role: 'viewer',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ])

    await db.collection('projects').insertMany(
      seedProjects.map((project) => ({
        ...project,
        createdAt: now,
        updatedAt: now,
      }))
    )

    await db.collection('team').insertMany(
      seedTeam.map((member) => ({
        ...member,
        createdAt: now,
        updatedAt: now,
      }))
    )

    await db.collection('blogs').insertOne({
      title: 'How We Approach Sustainable Architecture',
      slug: 'sustainable-architecture-approach',
      excerpt: 'A practical look at our sustainability process from concept through delivery.',
      content:
        'Sustainability starts in the earliest concept phase. We combine site analysis, passive strategies, and lifecycle considerations before any detail drawings are produced.\n\nDuring delivery, we coordinate closely with consultants and contractors to preserve design intent and reduce waste.',
      author: 'ArchiCore Team',
      tags: ['sustainability', 'process'],
      status: 'published',
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    })

    await db.collection('news').insertOne({
      title: 'ArchiCore Wins Regional Design Award 2026',
      slug: 'archicore-design-award-2026',
      excerpt: 'Our mixed-use project was recognized for innovation and urban impact.',
      content:
        'ArchiCore received the 2026 regional design award for our mixed-use tower concept.\n\nThe jury highlighted integrated public-space strategy and sustainability performance.',
      source: 'ArchiCore Press',
      status: 'published',
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    })

    await db.collection('services').insertMany([
      {
        title: 'Architectural Design',
        slug: 'architectural-design',
        summary: 'From concept studies to full permit sets and coordination.',
        description:
          'We provide complete architectural design services for residential, commercial, and mixed-use developments.',
        order: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Interior Design',
        slug: 'interior-design',
        summary: 'Function-driven and brand-aligned interior environments.',
        description:
          'Our interior design team develops spatial layouts, material palettes, and detailing to deliver coherent interiors.',
        order: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ])

    await db.collection('content').insertMany([
      {
        key: 'home',
        value: {
          heroBadge: 'Award-Winning Architecture Studio',
          heroTitle: 'Designing Spaces That Inspire and Endure',
          heroSubtitle:
            'We create architectural masterpieces that blend innovation with timeless elegance.',
          introTitle: 'Where Vision Meets Architectural Excellence',
          introText:
            'Founded in 2010, ArchiCore has become a leading practice in contemporary architecture.',
        },
        updatedAt: now,
      },
      {
        key: 'about',
        value: {
          heroTitle: "Crafting Tomorrow's Architecture Today",
          heroText:
            'ArchiCore is a multidisciplinary practice focused on meaningful and enduring spaces.',
        },
        updatedAt: now,
      },
    ])

    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('users').createIndex({ role: 1 }),
      db.collection('projects').createIndex({ slug: 1 }, { unique: true }),
      db.collection('projects').createIndex({ category: 1 }),
      db.collection('projects').createIndex({ featured: 1, status: 1 }),
      db.collection('projects').createIndex({ tags: 1 }),
      db.collection('team').createIndex({ order: 1, isActive: 1 }),
      db.collection('contacts').createIndex({ status: 1, createdAt: -1 }),
      db.collection('roles').createIndex({ name: 1 }, { unique: true }),
      db.collection('blogs').createIndex({ slug: 1 }, { unique: true }),
      db.collection('news').createIndex({ slug: 1 }, { unique: true }),
      db.collection('services').createIndex({ slug: 1 }, { unique: true }),
      db.collection('submissions').createIndex({ status: 1, createdAt: -1 }),
    ])

    console.log('Database seeded successfully.')
    console.log('Users:')
    console.log('  admin@archicore.com / Admin123!')
    console.log('  editor@archicore.com / Editor123!')
    console.log('  viewer@archicore.com / Viewer123!')

    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()
