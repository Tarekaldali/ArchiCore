import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  fullDescription: z.string().min(1, 'Full description is required'),
  category: z.enum(['residential', 'commercial', 'urban', 'interior']),
  images: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    alt: z.string(),
    isPrimary: z.boolean().default(false),
  })).default([]),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  architect: z.string().min(1, 'Architect name is required'),
  team: z.array(z.string()).optional().default([]),
  year: z.number().min(1900).max(new Date().getFullYear() + 5),
  area: z.number().positive().optional().nullable(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().min(1, 'Bio is required'),
  image: z.object({
    url: z.string(),
    publicId: z.string(),
  }).optional(),
  email: z.string().email().optional().or(z.literal('')),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.enum(['residential', 'commercial', 'urban', 'interior', 'other']).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type TeamMemberInput = z.infer<typeof teamMemberSchema>
export type ContactInput = z.infer<typeof contactSchema>
