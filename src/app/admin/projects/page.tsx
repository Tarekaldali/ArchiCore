'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react'
import type { Project } from '@/types'

export default function AdminProjectsPage() {
  const [search, setSearch] = React.useState('')
  const [projects, setProjects] = React.useState<Project[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects?status=all')
      const data = await response.json()
      if (data.projects) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProjects(projects.filter(p => p._id?.toString() !== id))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const toggleStatus = async (project: Project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published'
    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setProjects(projects.map(p =>
          p._id?.toString() === project._id?.toString()
            ? { ...p, status: newStatus }
            : p
        ))
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects ({projects.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProjects} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects table */}
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Title
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Category
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Status
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Year
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Location
                </th>
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {search ? 'No projects match your search.' : 'No projects found. Create your first project!'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project._id?.toString()} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{project.title}</span>
                        {project.featured && (
                          <Badge variant="accent" className="text-xs">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize">
                        {project.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(project)}
                        className="cursor-pointer"
                      >
                        <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {project.year}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">
                      {project.location?.city}, {project.location?.country}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" title="View">
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" title="Edit">
                          <Link href={`/admin/projects/${project._id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => handleDelete(project._id?.toString() || '')}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
