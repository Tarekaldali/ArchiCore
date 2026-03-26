import type { ObjectId } from 'mongodb'

export interface ServiceImage {
  url: string
  publicId?: string
  alt: string
}

export interface Service {
  _id?: ObjectId | string
  title: string
  slug: string
  summary: string
  description: string
  icon?: string
  image?: ServiceImage
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ServiceInput = Omit<Service, '_id' | 'createdAt' | 'updatedAt'>
