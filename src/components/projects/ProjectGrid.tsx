'use client'

import * as React from 'react'
import { ProjectCard } from './ProjectCard'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Project } from '@/types'

interface ProjectGridProps {
  projects: Project[] | Partial<Project>[]
  isLoading?: boolean
}

export function ProjectGrid({ projects, isLoading }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No projects found.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug || index} project={project} index={index} />
      ))}
    </div>
  )
}
