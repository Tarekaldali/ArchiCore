import { MongoClient } from 'mongodb'
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

    console.log('\n✅ Database seeded successfully!')
    console.log(`   - ${seedProjects.length} projects inserted`)
    console.log(`   - ${seedTeam.length} team members inserted`)

    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
