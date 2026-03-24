'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { PROJECT_CATEGORIES } from '@/constants/categories'
import { cn } from '@/lib/utils'

interface ProjectFiltersProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function ProjectFilters({ selectedCategory, onCategoryChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="relative"
      >
        All
        {selectedCategory === null && (
          <motion.span
            layoutId="activeFilter"
            className="absolute inset-0 bg-primary rounded-md -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Button>
      {PROJECT_CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className="capitalize"
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
