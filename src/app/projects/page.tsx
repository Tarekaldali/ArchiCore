'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { ProjectSearch } from '@/components/projects/ProjectSearch'
import { staggerContainer, staggerItem } from '@/constants/animations'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const [search, setSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch projects from API
  const fetchProjects = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (search) params.append('search', search)

      const response = await fetch(`/api/projects?${params.toString()}`)
      const data = await response.json()

      if (data.projects) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, search])

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchProjects])

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.p
              variants={staggerItem}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              Our Portfolio
            </motion.p>
            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Featured Projects
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="text-lg text-muted-foreground max-w-2xl"
            >
              Explore our collection of architectural works spanning residential, commercial,
              urban design, and interior projects across the globe.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b border-border sticky top-16 md:top-20 bg-background/80 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <ProjectFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <div className="w-full md:w-64">
              <ProjectSearch value={search} onChange={setSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectGrid projects={projects} isLoading={isLoading} />

          {!isLoading && projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                {search || selectedCategory
                  ? 'No projects match your criteria.'
                  : 'No projects found.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
