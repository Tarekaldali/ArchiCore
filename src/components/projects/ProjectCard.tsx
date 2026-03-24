'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { MapPin } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project | Partial<Project>
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || project.title || ''}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize backdrop-blur-sm bg-background/80">
              {project.category}
            </Badge>
          </div>

          {/* Quick info on hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 text-sm text-white">
              <MapPin className="w-4 h-4" />
              {project.location?.city}, {project.location?.country}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-display font-semibold group-hover:text-accent transition-colors line-clamp-1">
              {project.title}
            </h3>
            {project.year && (
              <span className="text-sm text-muted-foreground flex-shrink-0">
                {project.year}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
