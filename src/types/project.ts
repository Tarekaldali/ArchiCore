import type { ObjectId } from 'mongodb'

export interface ProjectImage {
  url: string
  publicId?: string
  alt: string
  isPrimary: boolean
}

export interface ProjectLocation {
  city: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export type ProjectCategory = 'residential' | 'commercial' | 'urban' | 'interior'
export type ProjectStatus = 'draft' | 'published'

export interface Project {
  _id: ObjectId | string
  title: string
  slug: string
  description: string
  fullDescription: string
  category: ProjectCategory
  images: ProjectImage[]
  location: ProjectLocation
  architect: string
  team?: string[]
  year: number
  area?: number
  tags: string[]
  featured: boolean
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
}

export type ProjectWithoutId = Omit<Project, '_id'>
export type ProjectInput = Omit<Project, '_id' | 'createdAt' | 'updatedAt'>
