'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface ProjectInterestFormProps {
  projectId?: string
  projectSlug: string
  projectTitle: string
}

export function ProjectInterestForm({
  projectId,
  projectSlug,
  projectTitle,
}: ProjectInterestFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    message: '',
  })

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          projectId,
          projectSlug,
          projectTitle,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setIsSuccess(true)
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        budget: '',
        message: '',
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-muted/50 rounded-lg p-6">
      <h3 className="font-display font-semibold mb-2">Interested in this project?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Send your details and our team will contact you.
      </p>

      {isSuccess ? (
        <div className="rounded-md border border-green-300 bg-green-50 text-green-700 text-sm p-3">
          Your request was submitted successfully.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            label="Company"
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          />
          <Input
            label="Budget"
            value={form.budget}
            onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
            placeholder="e.g. 250k - 500k"
          />
          <Textarea
            label="Message"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            rows={4}
            required
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit Interest'}
          </Button>
        </form>
      )}
    </div>
  )
}
