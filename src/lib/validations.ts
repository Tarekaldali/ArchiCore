import { z } from 'zod'
import { AVAILABLE_PERMISSIONS } from '@/types/role'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  fullDescription: z.string().min(1, 'Full description is required'),
  category: z.enum(['residential', 'commercial', 'urban', 'interior']),
  images: z.array(z.object({
    url: z.string(),
    publicId: z.string().optional(),
    alt: z.string(),
    isPrimary: z.boolean().default(false),
  })).default([]),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  architect: z.string().min(1, 'Architect name is required'),
  team: z.array(z.string()).optional().default([]),
  year: z.preprocess(
    (value) => (typeof value === 'number' ? value : Number(value)),
    z.number().min(1900).max(new Date().getFullYear() + 5)
  ),
  area: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return undefined
      const parsed = typeof value === 'number' ? value : Number(value)
      return Number.isNaN(parsed) ? undefined : parsed
    },
    z.number().positive().optional()
  ),
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

export const roleSchema = z.object({
  name: z.string().min(2, 'Role name is required').max(50),
  permissions: z.array(z.enum(AVAILABLE_PERMISSIONS)).min(1, 'Select at least one permission'),
})

export const blogSchema = z.object({
  title: z.string().min(3, 'Title is required').max(160),
  slug: z.string().min(3, 'Slug is required').max(160),
  excerpt: z.string().min(10, 'Excerpt is required').max(300),
  content: z.string().min(20, 'Content is required'),
  coverImage: z.object({
    url: z.string(),
    publicId: z.string().optional(),
    alt: z.string().default('Blog image'),
  }).optional(),
  author: z.string().min(2, 'Author is required'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const newsSchema = z.object({
  title: z.string().min(3, 'Title is required').max(160),
  slug: z.string().min(3, 'Slug is required').max(160),
  excerpt: z.string().min(10, 'Excerpt is required').max(300),
  content: z.string().min(20, 'Content is required'),
  coverImage: z.object({
    url: z.string(),
    publicId: z.string().optional(),
    alt: z.string().default('News image'),
  }).optional(),
  source: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const serviceSchema = z.object({
  title: z.string().min(3, 'Title is required').max(120),
  slug: z.string().min(3, 'Slug is required').max(120),
  summary: z.string().min(10, 'Summary is required').max(240),
  description: z.string().min(20, 'Description is required'),
  icon: z.string().optional().or(z.literal('')),
  image: z.object({
    url: z.string(),
    publicId: z.string().optional(),
    alt: z.string().default('Service image'),
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

export const projectInterestSchema = z.object({
  projectId: z.string().optional(),
  projectSlug: z.string().optional(),
  projectTitle: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type TeamMemberInput = z.infer<typeof teamMemberSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type RoleInput = z.infer<typeof roleSchema>
export type BlogInput = z.infer<typeof blogSchema>
export type NewsInput = z.infer<typeof newsSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type ProjectInterestInput = z.infer<typeof projectInterestSchema>
