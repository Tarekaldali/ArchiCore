import type { ObjectId } from 'mongodb'

export type SubmissionStatus = 'new' | 'reviewed' | 'contacted' | 'archived'

export interface ProjectInterestSubmission {
  _id?: ObjectId | string
  projectId?: string
  projectSlug?: string
  projectTitle?: string
  name: string
  email: string
  phone?: string
  company?: string
  budget?: string
  message: string
  status: SubmissionStatus
  createdAt: Date
  updatedAt: Date
}

export type ProjectInterestSubmissionInput = Omit<
  ProjectInterestSubmission,
  '_id' | 'status' | 'createdAt' | 'updatedAt'
>
