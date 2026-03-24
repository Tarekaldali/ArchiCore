'use client'

import * as React from 'react'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'

interface ProjectSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ProjectSearch({ value, onChange, placeholder = 'Search projects...' }: ProjectSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
