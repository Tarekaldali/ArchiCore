'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_STATUS } from '@/constants/categories'
import { projectSchema, type ProjectInput } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

type FormData = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [images, setImages] = React.useState<{ url: string; publicId: string; alt: string; isPrimary: boolean }[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'draft',
      featured: false,
      tags: [],
      images: []
    }
  })

  const title = watch('title')

  // Auto-generate slug from title
  React.useEffect(() => {
    if (title) {
      setValue('slug', slugify(title))
    }
  }, [title, setValue])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // For demo, we'll use placeholder URLs
    // In production, this would upload to Cloudinary
    const newImages = Array.from(files).map((file, index) => ({
      url: URL.createObjectURL(file),
      publicId: `temp_${Date.now()}_${index}`,
      alt: file.name.replace(/\.[^/.]+$/, ''),
      isPrimary: images.length === 0 && index === 0
    }))

    setImages([...images, ...newImages])
    setValue('images', [...images, ...newImages])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // If we removed the primary image, make the first one primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    setImages(newImages)
    setValue('images', newImages)
  }

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }))
    setImages(newImages)
    setValue('images', newImages)
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create project')
      }

      // Success - redirect to projects list
      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
      alert(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/projects">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold">New Project</h1>
          <p className="text-muted-foreground mt-1">Add a new project to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Project Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="e.g., Modern Lakeside Villa"
                />

                <Input
                  label="Slug"
                  {...register('slug')}
                  error={errors.slug?.message}
                  placeholder="modern-lakeside-villa"
                />

                <Textarea
                  label="Short Description"
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="A brief description for project cards..."
                  rows={3}
                />

                <Textarea
                  label="Full Description"
                  {...register('fullDescription')}
                  error={errors.fullDescription?.message}
                  placeholder="Detailed project description..."
                  rows={8}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload area */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {/* Image preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                            image.isPrimary ? 'border-accent' : 'border-transparent'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={() => setPrimaryImage(index)}
                              title="Set as primary"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={() => removeImage(index)}
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {image.isPrimary && (
                            <span className="absolute top-2 left-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Category"
                  options={PROJECT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                  {...register('category')}
                  error={errors.category?.message}
                />

                <Select
                  label="Status"
                  options={PROJECT_STATUS.map(s => ({ value: s.value, label: s.label }))}
                  {...register('status')}
                />

                <Input
                  label="Year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  error={errors.year?.message}
                  placeholder="2024"
                />

                <Input
                  label="Lead Architect"
                  {...register('architect')}
                  error={errors.architect?.message}
                />

                <Input
                  label="Area (m²)"
                  type="number"
                  {...register('area', { valueAsNumber: true })}
                  error={errors.area?.message}
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="rounded border-border"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Featured project
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="City"
                  {...register('location.city')}
                  error={errors.location?.city?.message}
                />

                <Input
                  label="Country"
                  {...register('location.country')}
                  error={errors.location?.country?.message}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="sustainable, modern, luxury"
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    setValue('tags', tags)
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
