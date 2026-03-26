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

interface ServiceItem {
  _id: string
  title: string
  slug: string
  summary: string
  description: string
  icon?: string
  order: number
  isActive: boolean
  image?: {
    url: string
    publicId?: string
    alt: string
  }
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  icon: '',
  order: 0,
  isActive: true,
  imageUrl: '',
  imageId: '',
}

export default function AdminServicesPage() {
  const toast = useToast()
  const [items, setItems] = React.useState<ServiceItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY_FORM)

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/services?active=all')
      const data = await response.json()
      setItems(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Failed to fetch services')
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

  const startEdit = (item: ServiceItem) => {
    setShowForm(true)
    setEditingId(item._id)
    setForm({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      description: item.description,
      icon: item.icon || '',
      order: item.order || 0,
      isActive: item.isActive,
      imageUrl: item.image?.url || '',
      imageId: item.image?.publicId || '',
    })
  }

  const saveItem = async () => {
    if (!form.title || !form.slug || !form.summary || !form.description) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title) || `service-${Date.now()}`,
        summary: form.summary,
        description: form.description,
        icon: form.icon,
        order: Number(form.order) || 0,
        isActive: form.isActive,
        image: form.imageUrl
          ? {
            url: form.imageUrl,
            publicId: form.imageId || undefined,
            alt: form.title,
          }
          : undefined,
      }

      const response = await fetch(editingId ? `/api/services/${editingId}` : '/api/services', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        const details = Array.isArray(data.details) ? data.details[0]?.message : null
        toast.error(details ? `${data.error}: ${details}` : (data.error || 'Failed to save service'))
        return
      }

      toast.success(editingId ? 'Service updated' : 'Service created')
      resetForm()
      fetchItems()
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async (item: ServiceItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return

    try {
      const response = await fetch(`/api/services/${item._id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Failed to delete service')
        return
      }

      toast.success('Service deleted')
      fetchItems()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">Manage service offerings shown on the website.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchItems} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={startCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Service' : 'Add Service'}</CardTitle>
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
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Icon (optional)"
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="Building2"
              />
              <Input
                label="Order"
                type="number"
                value={String(form.order)}
                onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
              />
              <label className="flex items-center gap-2 text-sm mt-8">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                Active
              </label>
            </div>
            <Textarea
              label="Summary"
              value={form.summary}
              onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
              rows={2}
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={6}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Service Image</label>
              <ImageUpload
                value={form.imageUrl}
                onChange={(url, publicId) => setForm((prev) => ({
                  ...prev,
                  imageUrl: url,
                  imageId: publicId || '',
                }))}
                aspectRatio="video"
                placeholder="Upload service image"
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
          <CardTitle>All Services ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No services yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{item.title}</p>
                      <Badge variant={item.isActive ? 'accent' : 'secondary'}>
                        {item.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.summary}</p>
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
