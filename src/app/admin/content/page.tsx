'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { RefreshCw, Save } from 'lucide-react'

interface HomeContent {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  introTitle: string
  introText: string
}

interface AboutContent {
  heroTitle: string
  heroText: string
}

export default function AdminContentPage() {
  const toast = useToast()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [homeContent, setHomeContent] = React.useState<HomeContent>({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    introTitle: '',
    introText: '',
  })
  const [aboutContent, setAboutContent] = React.useState<AboutContent>({
    heroTitle: '',
    heroText: '',
  })

  const fetchContent = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/content')
      const data = await response.json()
      if (data.home) setHomeContent(data.home)
      if (data.about) setAboutContent(data.about)
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to fetch content')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const saveSection = async (key: 'home' | 'about', value: HomeContent | AboutContent) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Failed to save content')
        return
      }
      toast.success(`${key === 'home' ? 'Home' : 'About'} content saved`)
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Website Content</h1>
          <p className="text-muted-foreground mt-1">Edit Home and About page texts.</p>
        </div>
        <Button variant="outline" onClick={fetchContent} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Home Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Hero Badge"
            value={homeContent.heroBadge}
            onChange={(e) => setHomeContent((prev) => ({ ...prev, heroBadge: e.target.value }))}
          />
          <Input
            label="Hero Title"
            value={homeContent.heroTitle}
            onChange={(e) => setHomeContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
          />
          <Textarea
            label="Hero Subtitle"
            value={homeContent.heroSubtitle}
            onChange={(e) => setHomeContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
            rows={3}
          />
          <Input
            label="Intro Title"
            value={homeContent.introTitle}
            onChange={(e) => setHomeContent((prev) => ({ ...prev, introTitle: e.target.value }))}
          />
          <Textarea
            label="Intro Text"
            value={homeContent.introText}
            onChange={(e) => setHomeContent((prev) => ({ ...prev, introText: e.target.value }))}
            rows={4}
          />
          <Button onClick={() => saveSection('home', homeContent)} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Home Content
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="About Hero Title"
            value={aboutContent.heroTitle}
            onChange={(e) => setAboutContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
          />
          <Textarea
            label="About Hero Text"
            value={aboutContent.heroText}
            onChange={(e) => setAboutContent((prev) => ({ ...prev, heroText: e.target.value }))}
            rows={4}
          />
          <Button onClick={() => saveSection('about', aboutContent)} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save About Content
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
