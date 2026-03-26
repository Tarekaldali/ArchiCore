import type { ObjectId } from 'mongodb'

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived'
export type ProjectTypeOption = 'residential' | 'commercial' | 'urban' | 'interior' | 'other'

export interface Contact {
  _id: ObjectId | string
  name: string
  email: string
  phone?: string
  company?: string
  projectType?: ProjectTypeOption
  message: string
  status: ContactStatus
  createdAt: Date
  updatedAt: Date
}

export type ContactInput = Omit<Contact, '_id' | 'status' | 'createdAt' | 'updatedAt'>
