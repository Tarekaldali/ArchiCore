import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().min(1, 'Description is required').max(300),
  fullDescription: z.string().min(1, 'Full description is required'),
  category: z.enum(['residential', 'commercial', 'urban', 'interior']),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string(),
    alt: z.string(),
    isPrimary: z.boolean().default(false),
  })).min(1, 'At least one image is required'),
  location: z.object({
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  architect: z.string().min(1, 'Architect name is required'),
  team: z.array(z.string()).optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 5),
  area: z.number().positive().optional(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
})

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().min(1, 'Bio is required'),
  image: z.object({
    url: z.string().url(),
    publicId: z.string(),
  }),
  email: z.string().email().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
  order: z.number().int().min(0),
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
