import { ObjectId } from 'mongodb'

export interface TeamMemberImage {
  url: string
  publicId: string
}

export interface SocialLinks {
  linkedin?: string
  instagram?: string
  twitter?: string
}

export interface TeamMember {
  _id: ObjectId | string
  name: string
  role: string
  bio: string
  image: TeamMemberImage
  email?: string
  socialLinks?: SocialLinks
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type TeamMemberInput = Omit<TeamMember, '_id' | 'createdAt' | 'updatedAt'>
