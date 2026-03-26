import 'dotenv/config'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { seedProjects } from '../src/data/seed-projects'
import { seedTeam } from '../src/data/seed-team'

const MONGODB_URI = process.env.MONGODB_URI

async function seed() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set')
    console.log('Please create a .env file with your MongoDB connection string:')
    console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/archicore')
    process.exit(1)
  }

  console.log('🌱 Starting database seed...\n')

  try {
    const client = await MongoClient.connect(MONGODB_URI)
    const db = client.db('archicore')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await db.collection('projects').deleteMany({})
    await db.collection('team').deleteMany({})
    await db.collection('users').deleteMany({})
    await db.collection('contacts').deleteMany({})

    // Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('Admin123!', 12)
    await db.collection('users').insertOne({
      name: 'Admin',
      email: 'admin@archicore.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create editor user
    console.log('👤 Creating editor user...')
    const editorPassword = await bcrypt.hash('Editor123!', 12)
    await db.collection('users').insertOne({
      name: 'Editor',
      email: 'editor@archicore.com',
      password: editorPassword,
      role: 'editor',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create viewer user
    console.log('👤 Creating viewer user...')
    const viewerPassword = await bcrypt.hash('Viewer123!', 12)
    await db.collection('users').insertOne({
      name: 'Viewer',
      email: 'viewer@archicore.com',
      password: viewerPassword,
      role: 'viewer',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create indexes for users
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('users').createIndex({ role: 1 })

    // Insert projects
    console.log(`📁 Inserting ${seedProjects.length} projects...`)
    const projectsWithTimestamps = seedProjects.map(project => ({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await db.collection('projects').insertMany(projectsWithTimestamps)

    // Create indexes for projects
    await db.collection('projects').createIndex({ slug: 1 }, { unique: true })
    await db.collection('projects').createIndex({ category: 1 })
    await db.collection('projects').createIndex({ featured: 1, status: 1 })
    await db.collection('projects').createIndex({ tags: 1 })

    // Insert team members
    console.log(`👥 Inserting ${seedTeam.length} team members...`)
    const teamWithTimestamps = seedTeam.map(member => ({
      ...member,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await db.collection('team').insertMany(teamWithTimestamps)

    // Create indexes for team
    await db.collection('team').createIndex({ order: 1, isActive: 1 })

    // Create indexes for contacts
    await db.collection('contacts').createIndex({ status: 1, createdAt: -1 })

    console.log('\n✅ Database seeded successfully!')
    console.log('   📊 Collections created:')
    console.log('   - users (3 users: admin, editor, viewer)')
    console.log(`   - projects (${seedProjects.length} projects)`)
    console.log(`   - team (${seedTeam.length} members)`)
    console.log('   - contacts (empty, ready for submissions)')
    console.log('\n   🔑 Default Users:')
    console.log('   - Admin: admin@archicore.com / Admin123!')
    console.log('   - Editor: editor@archicore.com / Editor123!')
    console.log('   - Viewer: viewer@archicore.com / Viewer123!')

    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
