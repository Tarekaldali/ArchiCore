'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, staggerItem } from '@/constants/animations'
import type { Project } from '@/types'

// Sample featured projects for initial display
const SAMPLE_PROJECTS: Partial<Project>[] = [
  {
    slug: 'azure-cliff-residence',
    title: 'Azure Cliff Residence',
    description: 'A stunning cantilevered home perched on coastal cliffs with panoramic ocean views.',
    category: 'residential',
    location: { city: 'Malibu', country: 'USA' },
    year: 2024,
    images: [{
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      publicId: '',
      alt: 'Azure Cliff Residence',
      isPrimary: true
    }]
  },
  {
    slug: 'vertex-tower',
    title: 'Vertex Tower',
    description: 'A 45-story mixed-use skyscraper redefining urban density with sustainable design.',
    category: 'commercial',
    location: { city: 'Singapore', country: 'Singapore' },
    year: 2023,
    images: [{
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      publicId: '',
      alt: 'Vertex Tower',
      isPrimary: true
    }]
  },
  {
    slug: 'minimalist-penthouse',
    title: 'Minimalist Penthouse',
    description: 'A 3,000 sq ft penthouse celebrating negative space and natural light.',
    category: 'interior',
    location: { city: 'Tokyo', country: 'Japan' },
    year: 2024,
    images: [{
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      publicId: '',
      alt: 'Minimalist Penthouse',
      isPrimary: true
    }]
  }
]

interface FeaturedProjectsProps {
  projects?: Partial<Project>[]
}

export function FeaturedProjects({ projects = SAMPLE_PROJECTS }: FeaturedProjectsProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <motion.p
              variants={staggerItem}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              Featured Work
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold"
            >
              Our Latest Projects
            </motion.h2>
          </div>
          <motion.div variants={staggerItem} className="mt-6 md:mt-0">
            <Button asChild variant="outline" className="group">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.slug} variants={staggerItem}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={project.images?.[0]?.url || ''}
                    alt={project.title || ''}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Overlay content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge variant="accent" className="w-fit mb-2 capitalize">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-display font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {project.location?.city}, {project.location?.country}
                    </p>
                  </div>
                </div>

                {/* Below image info (always visible) */}
                <div className="mt-4">
                  <h3 className="text-lg font-display font-semibold group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
