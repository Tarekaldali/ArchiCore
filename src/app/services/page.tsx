import Link from 'next/link'
import { Metadata } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore ArchiCore services across architecture, interiors, planning, and consulting.',
}

async function getServices() {
  try {
    const db = await connectToDatabase()
    return await db.collection('services')
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .toArray()
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-medium tracking-widest uppercase mb-4">Our Services</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            End-to-End Architecture Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            We support projects from strategy and concept design to execution and post-occupancy optimization.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-16 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">No services published yet.</p>
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <article key={service._id?.toString()} className="border border-border rounded-xl overflow-hidden bg-background">
                  {service.image?.url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={service.image.url}
                        alt={service.image.alt || service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-display font-semibold">{service.title}</h2>
                      {service.icon && <Badge variant="secondary">{service.icon}</Badge>}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{service.summary}</p>
                    <p className="text-sm leading-relaxed">{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
