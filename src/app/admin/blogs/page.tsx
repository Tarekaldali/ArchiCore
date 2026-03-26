'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'
import { slugify } from '@/lib/utils'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'

type BlogStatus = 'draft' | 'published'

interface BlogItem {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  tags: string[]
  status: BlogStatus
  coverImage?: {
    url: string
    publicId?: string
    alt: string
  }
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  tags: '',
  status: 'draft' as BlogStatus,
  coverImageUrl: '',
  coverImageId: '',
}

export default function AdminBlogsPage() {
  const toast = useToast()
  const [items, setItems] = React.useState<BlogItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY_FORM)

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/blogs?status=all')
      const data = await response.json()
      setItems(data.blogs || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to fetch blogs')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  const startCreate = () => {
    setShowForm(true)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const startEdit = (item: BlogItem) => {
    setShowForm(true)
    setEditingId(item._id)
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      author: item.author,
      tags: item.tags.join(', '),
      status: item.status,
      coverImageUrl: item.coverImage?.url || '',
      coverImageId: item.coverImage?.publicId || '',
    })
  }

  const saveItem = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content || !form.author) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title) || `blog-${Date.now()}`,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        status: form.status,
        coverImage: form.coverImageUrl
          ? {
            url: form.coverImageUrl,
            publicId: form.coverImageId || undefined,
            alt: form.title,
          }
          : undefined,
      }

      const response = await fetch(editingId ? `/api/blogs/${editingId}` : '/api/blogs', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        const details = Array.isArray(data.details) ? data.details[0]?.message : null
        toast.error(details ? `${data.error}: ${details}` : (data.error || 'Failed to save blog'))
        return
      }

      toast.success(editingId ? 'Blog updated' : 'Blog created')
      resetForm()
      fetchItems()
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Failed to save blog')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async (item: BlogItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return
    try {
      const response = await fetch(`/api/blogs/${item._id}`, { method: 'DELETE' })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to delete blog')
        return
      }

      toast.success('Blog deleted')
      fetchItems()
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Blogs</h1>
          <p className="text-muted-foreground mt-1">Create and manage blog content.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchItems} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={startCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Blog
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Blog' : 'Add Blog'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: prev.slug || slugify(e.target.value),
                }))}
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Author"
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as BlogStatus }))}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <Input
              label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
            <Textarea
              label="Excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
            />
            <Textarea
              label="Content"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={8}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <ImageUpload
                value={form.coverImageUrl}
                onChange={(url, publicId) => setForm((prev) => ({
                  ...prev,
                  coverImageUrl: url,
                  coverImageId: publicId || '',
                }))}
                aspectRatio="video"
                placeholder="Upload cover image"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveItem} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Blogs ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No blog posts yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{item.title}</p>
                      <Badge variant={item.status === 'published' ? 'accent' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.excerpt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteItem(item)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
