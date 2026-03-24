import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

interface MongoConnection {
  client: MongoClient
  db: Db
}

let cached: MongoConnection | null = null

export async function connectToDatabase(): Promise<Db> {
  if (cached) {
    return cached.db
  }

  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db('archicore')

  cached = { client, db }
  return db
}

export async function getCollection(name: string) {
  const db = await connectToDatabase()
  return db.collection(name)
}
