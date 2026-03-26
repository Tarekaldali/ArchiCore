'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { ProjectSearch } from '@/components/projects/ProjectSearch'
import { fadeInUp, staggerContainer, staggerItem } from '@/constants/animations'
import type { Project } from '@/types'

// Sample projects data - will be replaced with API call
const SAMPLE_PROJECTS: Partial<Project>[] = [
  {
    slug: 'azure-cliff-residence',
    title: 'Azure Cliff Residence',
    description: 'A stunning cantilevered home perched on coastal cliffs with panoramic ocean views.',
    category: 'residential',
    location: { city: 'Malibu', country: 'USA' },
    year: 2024,
    images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', publicId: '', alt: 'Azure Cliff Residence', isPrimary: true }]
  },
  {
    slug: 'vertex-tower',
    title: 'Vertex Tower',
    description: 'A 45-story mixed-use skyscraper redefining urban density with sustainable design.',
    category: 'commercial',
    location: { city: 'Singapore', country: 'Singapore' },
    year: 2023,
    images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', publicId: '', alt: 'Vertex Tower', isPrimary: true }]
  },
  {
    slug: 'minimalist-penthouse',
    title: 'Minimalist Penthouse',
    description: 'A 3,000 sq ft penthouse celebrating negative space and natural light.',
    category: 'interior',
    location: { city: 'Tokyo', country: 'Japan' },
    year: 2024,
    images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', publicId: '', alt: 'Minimalist Penthouse', isPrimary: true }]
  },
  {
    slug: 'garden-district-masterplan',
    title: 'Garden District Masterplan',
    description: 'A 50-acre urban renewal project emphasizing green corridors and community spaces.',
    category: 'urban',
    location: { city: 'Melbourne', country: 'Australia' },
    year: 2023,
    images: [{ url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80', publicId: '', alt: 'Garden District', isPrimary: true }]
  },
  {
    slug: 'coastal-retreat',
    title: 'Coastal Retreat',
    description: 'A serene beachfront villa blending indoor and outdoor living seamlessly.',
    category: 'residential',
    location: { city: 'Byron Bay', country: 'Australia' },
    year: 2024,
    images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', publicId: '', alt: 'Coastal Retreat', isPrimary: true }]
  },
  {
    slug: 'innovation-hub',
    title: 'Innovation Hub',
    description: 'A cutting-edge tech campus designed to foster creativity and collaboration.',
    category: 'commercial',
    location: { city: 'San Francisco', country: 'USA' },
    year: 2023,
    images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', publicId: '', alt: 'Innovation Hub', isPrimary: true }]
  },
  {
    slug: 'art-gallery-renovation',
    title: 'Art Gallery Renovation',
    description: 'A historic gallery transformed with modern interventions respecting its heritage.',
    category: 'interior',
    location: { city: 'London', country: 'UK' },
    year: 2022,
    images: [{ url: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80', publicId: '', alt: 'Art Gallery', isPrimary: true }]
  },
  {
    slug: 'waterfront-promenade',
    title: 'Waterfront Promenade',
    description: 'A vibrant public space connecting the city to its waterfront heritage.',
    category: 'urban',
    location: { city: 'Copenhagen', country: 'Denmark' },
    year: 2023,
    images: [{ url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', publicId: '', alt: 'Waterfront', isPrimary: true }]
  },
  {
    slug: 'mountain-sanctuary',
    title: 'Mountain Sanctuary',
    description: 'A luxury retreat nestled in the mountains with floor-to-ceiling alpine views.',
    category: 'residential',
    location: { city: 'Aspen', country: 'USA' },
    year: 2024,
    images: [{ url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80', publicId: '', alt: 'Mountain Sanctuary', isPrimary: true }]
  }
]

export default function ProjectsPage() {
  const [search, setSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    return SAMPLE_PROJECTS.filter((project) => {
      const matchesCategory = !selectedCategory || project.category === selectedCategory
      const matchesSearch = !search ||
        project.title?.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

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
          <ProjectGrid projects={filteredProjects} isLoading={isLoading} />
        </div>
      </section>
    </div>
  )
}
