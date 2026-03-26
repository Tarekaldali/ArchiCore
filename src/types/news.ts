import type { ObjectId } from 'mongodb'

export type NewsStatus = 'draft' | 'published'

export interface NewsImage {
  url: string
  publicId?: string
  alt: string
}

export interface News {
  _id?: ObjectId | string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: NewsImage
  source?: string
  status: NewsStatus
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type NewsInput = Omit<News, '_id' | 'createdAt' | 'updatedAt'>
