import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  const normalized = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

  const safe = normalized
    .split('')
    .filter((char) => {
      if (char === ' ' || char === '-') return true
      if (/[a-z0-9]/.test(char)) return true
      // Keep non-Latin letters while removing most symbols.
      return char.toLowerCase() !== char.toUpperCase()
    })
    .join('')

  return safe
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}
