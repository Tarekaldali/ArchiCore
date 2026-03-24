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
  MoreHorizontal
} from 'lucide-react'
import type { Project } from '@/types'

// Sample projects for display
const SAMPLE_PROJECTS: Partial<Project>[] = [
  {
    _id: '1',
    slug: 'azure-cliff-residence',
    title: 'Azure Cliff Residence',
    category: 'residential',
    status: 'published',
    featured: true,
    year: 2024,
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: '2',
    slug: 'vertex-tower',
    title: 'Vertex Tower',
    category: 'commercial',
    status: 'published',
    featured: true,
    year: 2023,
    createdAt: new Date('2024-01-10'),
  },
  {
    _id: '3',
    slug: 'minimalist-penthouse',
    title: 'Minimalist Penthouse',
    category: 'interior',
    status: 'published',
    featured: false,
    year: 2024,
    createdAt: new Date('2024-01-05'),
  },
  {
    _id: '4',
    slug: 'garden-district',
    title: 'Garden District Masterplan',
    category: 'urban',
    status: 'draft',
    featured: false,
    year: 2023,
    createdAt: new Date('2024-01-01'),
  },
]

export default function AdminProjectsPage() {
  const [search, setSearch] = React.useState('')
  const [projects, setProjects] = React.useState(SAMPLE_PROJECTS)

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p._id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
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
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
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
                    <Badge variant={project.status === 'published' ? 'success' : 'warning'}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.year}
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
