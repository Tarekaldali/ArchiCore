'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Save, RefreshCw, CheckCircle } from 'lucide-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    instagram: string
    linkedin: string
    twitter: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialLinks: {
      instagram: '',
      linkedin: '',
      twitter: ''
    }
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSettings()
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)
    setSaved(false)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your site configuration</p>
        </div>
        <Button onClick={fetchSettings} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Basic site information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={e => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="ArchiCore"
            />
            <Textarea
              label="Site Description"
              value={settings.siteDescription}
              onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
              placeholder="Architecture Portfolio"
              rows={2}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How clients can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="hello@archicore.com"
              />
              <Input
                label="Phone"
                value={settings.contactPhone}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+1 (234) 567-890"
              />
            </div>
            <Textarea
              label="Address"
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              placeholder="123 Architecture Avenue, New York, NY 10001"
              rows={2}
            />
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Instagram"
              value={settings.socialLinks.instagram}
              onChange={e => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/archicore"
            />
            <Input
              label="LinkedIn"
              value={settings.socialLinks.linkedin}
              onChange={e => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/company/archicore"
            />
            <Input
              label="Twitter / X"
              value={settings.socialLinks.twitter}
              onChange={e => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/archicore"
            />
          </CardContent>
        </Card>

        {/* Save Button at the bottom */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={isSaving} size="lg">
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
