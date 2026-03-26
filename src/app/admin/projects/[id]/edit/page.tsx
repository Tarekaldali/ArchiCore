'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_STATUS } from '@/constants/categories'
import { projectSchema } from '@/lib/validations'

type FormData = z.infer<typeof projectSchema>

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const projectId = params.id
  const toast = useToast()

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [tagsInput, setTagsInput] = React.useState('')
  const [images, setImages] = React.useState<{ url: string; publicId?: string; alt: string; isPrimary: boolean }[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
  })

  const fetchProject = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const project = await response.json()

      if (!response.ok) {
        throw new Error(project.error || 'Failed to load project')
      }

      const formData: FormData = {
        title: project.title || '',
        slug: project.slug || '',
        description: project.description || '',
        fullDescription: project.fullDescription || '',
        category: project.category || 'residential',
        images: project.images || [],
        location: {
          city: project.location?.city || '',
          country: project.location?.country || '',
        },
        architect: project.architect || '',
        team: project.team || [],
        year: Number(project.year) || new Date().getFullYear(),
        area: project.area || undefined,
        tags: project.tags || [],
        featured: !!project.featured,
        status: project.status || 'draft',
      }

      reset(formData)
      setImages(project.images || [])
      setTagsInput((project.tags || []).join(', '))
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project data')
      router.push('/admin/projects')
    } finally {
      setIsLoading(false)
    }
  }, [projectId, reset, router, toast])

  React.useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId, fetchProject])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)
    const newImages: { url: string; publicId?: string; alt: string; isPrimary: boolean }[] = []

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push({
            url: data.url,
            publicId: data.publicId,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            isPrimary: images.length === 0 && i === 0,
          })
        } else {
          const data = await response.json()
          toast.error(data.error || `Failed to upload ${file.name}`)
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      setValue('images', updatedImages)
      toast.success(`${newImages.length} image(s) uploaded`)
    }

    setIsUploading(false)
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, itemIndex) => itemIndex !== index)
    if (images[index]?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true
    }
    setImages(updatedImages)
    setValue('images', updatedImages)
  }

  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((image, itemIndex) => ({
      ...image,
      isPrimary: itemIndex === index,
    }))
    setImages(updatedImages)
    setValue('images', updatedImages)
  }

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) {
        const details = Array.isArray(data.details) ? data.details[0]?.message : null
        throw new Error(details ? `${data.error}: ${details}` : (data.error || 'Failed to update project'))
      }

      toast.success('Project updated successfully')
      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update project')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
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
          <h1 className="text-3xl font-display font-bold">Edit Project</h1>
          <p className="text-muted-foreground mt-1">Update project details and media</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
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
                />
                <Input
                  label="Slug"
                  {...register('slug')}
                  error={errors.slug?.message}
                />
                <Textarea
                  label="Short Description"
                  {...register('description')}
                  error={errors.description?.message}
                  rows={3}
                />
                <Textarea
                  label="Full Description"
                  {...register('fullDescription')}
                  error={errors.fullDescription?.message}
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
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-muted-foreground mb-2 animate-spin" />
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload images</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={`${image.url}-${index}`}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 ${image.isPrimary ? 'border-accent' : 'border-transparent'}`}
                        >
                          <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={() => setPrimaryImage(index)}
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={() => removeImage(index)}
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Category"
                  options={PROJECT_CATEGORIES.map((item) => ({ value: item.value, label: item.label }))}
                  {...register('category')}
                  error={errors.category?.message}
                />
                <Select
                  label="Status"
                  options={PROJECT_STATUS.map((item) => ({ value: item.value, label: item.label }))}
                  {...register('status')}
                />
                <Input
                  label="Year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  error={errors.year?.message}
                />
                <Input
                  label="Lead Architect"
                  {...register('architect')}
                  error={errors.architect?.message}
                />
                <Input
                  label="Area (m2)"
                  type="number"
                  {...register('area', { valueAsNumber: true })}
                  error={errors.area?.message}
                />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" {...register('featured')} className="rounded border-border" />
                  <label htmlFor="featured" className="text-sm">Featured project</label>
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
                  value={tagsInput}
                  onChange={(e) => {
                    const next = e.target.value
                    setTagsInput(next)
                    const tags = next.split(',').map((tag) => tag.trim()).filter(Boolean)
                    setValue('tags', tags)
                  }}
                  placeholder="sustainable, modern, luxury"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
