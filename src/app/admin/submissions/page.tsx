'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Inbox, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react'

type SubmissionStatus = 'new' | 'reviewed' | 'contacted' | 'archived'

interface Submission {
  _id: string
  projectTitle?: string
  projectSlug?: string
  name: string
  email: string
  phone?: string
  company?: string
  budget?: string
  message: string
  status: SubmissionStatus
  createdAt: string
}

const STATUS_OPTIONS: SubmissionStatus[] = ['new', 'reviewed', 'contacted', 'archived']

export default function AdminSubmissionsPage() {
  const toast = useToast()
  const [items, setItems] = React.useState<Submission[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<'all' | SubmissionStatus>('all')
  const [selected, setSelected] = React.useState<Submission | null>(null)

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/submissions${params}`)
      const data = await response.json()
      setItems(data.submissions || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Failed to fetch submissions')
    } finally {
      setIsLoading(false)
    }
  }, [filter, toast])

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Failed to update submission')
        return
      }

      setItems((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)))
      if (selected?._id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : null))
      }
      toast.success('Submission updated')
    } catch (error) {
      console.error('Error updating submission:', error)
      toast.error('Failed to update submission')
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this submission?')) return

    try {
      const response = await fetch(`/api/submissions?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Failed to delete submission')
        return
      }

      setItems((prev) => prev.filter((item) => item._id !== id))
      if (selected?._id === id) {
        setSelected(null)
      }
      toast.success('Submission deleted')
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error('Failed to delete submission')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Project Submissions</h1>
          <p className="text-muted-foreground mt-1">Leads submitted from project detail pages.</p>
        </div>
        <Button onClick={fetchItems} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', ...STATUS_OPTIONS] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filter === status ? 'default' : 'outline'}
            className="capitalize"
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No submissions found</p>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={item._id}
                className={`cursor-pointer ${selected?._id === item._id ? 'border-accent' : ''}`}
                onClick={() => setSelected(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                    </div>
                    <Badge variant={item.status === 'new' ? 'accent' : 'secondary'}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 truncate">
                    {item.projectTitle || item.projectSlug || 'General project inquiry'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selected.projectTitle || selected.projectSlug || 'General project inquiry'}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selected.status === status ? 'default' : 'outline'}
                        className="capitalize"
                        onClick={() => updateStatus(selected._id, status)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {status}
                      </Button>
                    ))}
                    <Button variant="destructive" size="sm" onClick={() => deleteSubmission(selected._id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selected.email}</p>
                  </div>
                  {selected.phone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selected.phone}</p>
                    </div>
                  )}
                  {selected.company && (
                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-medium">{selected.company}</p>
                    </div>
                  )}
                  {selected.budget && (
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{selected.budget}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-muted-foreground text-sm mb-2">Message</p>
                  <p className="whitespace-pre-wrap text-sm">{selected.message}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-14 text-center">
                <p className="text-muted-foreground">Select a submission to view details.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
