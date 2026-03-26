import type { ObjectId } from 'mongodb'

export type BlogStatus = 'draft' | 'published'

export interface BlogImage {
  url: string
  publicId?: string
  alt: string
}

export interface Blog {
  _id?: ObjectId | string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: BlogImage
  author: string
  tags: string[]
  status: BlogStatus
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type BlogInput = Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>
