'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { staggerContainer, staggerItem } from '@/constants/animations'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
      } else {
        throw new Error('Failed to submit')
      }
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-2xl"
          >
            <motion.p
              variants={staggerItem}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              Get In Touch
            </motion.p>
            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Let&apos;s Create Something <span className="text-accent">Extraordinary</span>
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="text-lg text-muted-foreground"
            >
              Have a project in mind? We&apos;d love to hear from you. Send us a message
              and we&apos;ll get back to you within 24 hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact form */}
            <div className="lg:col-span-2">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-display font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setIsSuccess(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Name *"
                      {...register('name')}
                      error={errors.name?.message}
                      placeholder="Your name"
                    />
                    <Input
                      label="Email *"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone"
                      {...register('phone')}
                      error={errors.phone?.message}
                      placeholder="+1 (234) 567-890"
                    />
                    <Input
                      label="Company"
                      {...register('company')}
                      placeholder="Your company"
                    />
                  </div>

                  <Select
                    label="Project Type"
                    options={[
                      { value: 'residential', label: 'Residential' },
                      { value: 'commercial', label: 'Commercial' },
                      { value: 'urban', label: 'Urban Planning' },
                      { value: 'interior', label: 'Interior Design' },
                      { value: 'other', label: 'Other' }
                    ]}
                    placeholder="Select project type"
                    {...register('projectType')}
                  />

                  <Textarea
                    label="Message *"
                    {...register('message')}
                    error={errors.message?.message}
                    placeholder="Tell us about your project..."
                    rows={6}
                  />

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-display font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 text-accent">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground text-sm">
                        123 Architecture Avenue<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 text-accent">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a
                        href="tel:+1234567890"
                        className="text-muted-foreground text-sm hover:text-accent transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href="mailto:hello@archicore.com"
                        className="text-muted-foreground text-sm hover:text-accent transition-colors"
                      >
                        hello@archicore.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-muted-foreground text-sm">
                        Monday - Friday: 9am - 6pm<br />
                        Saturday: By appointment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Map integration available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
