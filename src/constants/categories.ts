export const PROJECT_CATEGORIES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'urban', label: 'Urban' },
  { value: 'interior', label: 'Interior' },
] as const

export const PROJECT_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
] as const

export type CategoryValue = typeof PROJECT_CATEGORIES[number]['value']
