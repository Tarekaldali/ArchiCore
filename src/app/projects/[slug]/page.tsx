import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, User, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import type { Project } from '@/types'

// Sample project data - will be replaced with database query
const SAMPLE_PROJECTS: Partial<Project>[] = [
  {
    slug: 'azure-cliff-residence',
    title: 'Azure Cliff Residence',
    description: 'A stunning cantilevered home perched on coastal cliffs with panoramic ocean views.',
    fullDescription: `The Azure Cliff Residence represents the pinnacle of modern coastal architecture. Perched dramatically on the rocky cliffs of Malibu, this 4,500 square foot home defies gravity with its bold cantilever extending over the Pacific Ocean.

The design philosophy centers on erasing the boundary between interior and exterior spaces. Floor-to-ceiling windows wrap the entire ocean-facing facade, creating an immersive experience where residents feel suspended above the waves.

Sustainable materials including reclaimed teak, locally-sourced limestone, and recycled steel form the structural backbone. The green roof system captures rainwater for irrigation, while passive solar design minimizes energy consumption year-round.

The interior spaces flow seamlessly from the open-plan living areas to private bedroom suites, each positioned to maximize natural light and ventilation. A floating staircase of glass and steel connects the three levels, serving as both circulation and sculptural centerpiece.`,
    category: 'residential',
    location: { city: 'Malibu', country: 'USA' },
    architect: 'Marcus Chen',
    team: ['Sarah Walsh', 'James Rivera', 'Elena Rodriguez'],
    year: 2024,
    area: 420,
    tags: ['coastal', 'sustainable', 'cantilever', 'luxury', 'modern'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80', publicId: '', alt: 'Azure Cliff Residence - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', publicId: '', alt: 'Azure Cliff Residence - Living Room', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', publicId: '', alt: 'Azure Cliff Residence - Kitchen', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80', publicId: '', alt: 'Azure Cliff Residence - Bedroom', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', publicId: '', alt: 'Azure Cliff Residence - Bathroom', isPrimary: false },
    ]
  },
  {
    slug: 'vertex-tower',
    title: 'Vertex Tower',
    description: 'A 45-story mixed-use skyscraper redefining urban density with sustainable design.',
    fullDescription: `Vertex Tower stands as Singapore's newest landmark, a 45-story mixed-use development that reimagines what sustainable urban density can achieve.

The building's distinctive twisted form is not merely aesthetic—it's engineered to reduce wind loads by 24% while maximizing natural ventilation to upper floors. The parametric facade system adjusts shading automatically based on sun position, reducing cooling loads significantly.

Lower floors house a vibrant retail podium and co-working spaces, transitioning to premium office space in the mid-levels. The upper third comprises luxury residences with unobstructed views of Marina Bay.

Sky gardens at every tenth floor provide communal green spaces for occupants, improving air quality and creating micro-communities within the vertical city. The building achieved Platinum certification under Singapore's Green Mark scheme.`,
    category: 'commercial',
    location: { city: 'Singapore', country: 'Singapore' },
    architect: 'David Okonkwo',
    team: ['Lisa Chang', 'Michael Torres'],
    year: 2023,
    area: 85000,
    tags: ['high-rise', 'sustainable', 'mixed-use', 'parametric', 'iconic'],
    images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80', publicId: '', alt: 'Vertex Tower - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=1200&q=80', publicId: '', alt: 'Vertex Tower - Lobby', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80', publicId: '', alt: 'Vertex Tower - Office', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', publicId: '', alt: 'Vertex Tower - Sky Garden', isPrimary: false },
    ]
  },
  {
    slug: 'minimalist-penthouse',
    title: 'Minimalist Penthouse',
    description: 'A 3,000 sq ft penthouse celebrating negative space and natural light.',
    fullDescription: `Located atop one of Tokyo's most prestigious residential towers, this penthouse embodies the Japanese philosophy of "Ma"—the purposeful use of negative space.

Every element has been carefully considered and edited. The open floor plan features just four pieces of custom furniture, each designed specifically for this space. Floor-to-ceiling windows on three sides flood the space with natural light, while automated shoji screens provide privacy when needed.

The material palette is deliberately restrained: Hinoki cypress, white plaster, and blackened steel. A single Isamu Noguchi light sculpture serves as the living area's focal point.

The kitchen features integrated appliances hidden behind flush panels, maintaining the serene visual flow. The master suite includes a private meditation room with views of Mount Fuji on clear days.`,
    category: 'interior',
    location: { city: 'Tokyo', country: 'Japan' },
    architect: 'Yuki Tanaka',
    team: ['Kenji Yamamoto'],
    year: 2024,
    area: 280,
    tags: ['minimalist', 'japanese', 'luxury', 'residential', 'zen'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', publicId: '', alt: 'Minimalist Penthouse - Living', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', publicId: '', alt: 'Minimalist Penthouse - Kitchen', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80', publicId: '', alt: 'Minimalist Penthouse - Bedroom', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80', publicId: '', alt: 'Minimalist Penthouse - Bathroom', isPrimary: false },
    ]
  }
]

function getProject(slug: string): Partial<Project> | undefined {
  return SAMPLE_PROJECTS.find(p => p.slug === slug)
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject(params.slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: project.title,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProject(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button asChild variant="ghost" className="group">
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {project.images && (
              <ProjectGallery images={project.images} title={project.title || ''} />
            )}

            {/* Description */}
            <div className="mt-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {project.description}
              </p>

              {project.fullDescription && (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {project.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Project info card */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-display font-semibold text-lg">Project Details</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {project.location?.city}, {project.location?.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium">{project.year}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lead Architect</p>
                      <p className="font-medium">{project.architect}</p>
                    </div>
                  </div>

                  {project.area && (
                    <div className="flex items-start gap-3">
                      <Ruler className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-medium">{project.area.toLocaleString()} m²</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <Badge variant="accent" className="capitalize">
                    {project.category}
                  </Badge>
                </div>

                {/* Team */}
                {project.team && project.team.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Team</p>
                    <ul className="space-y-1">
                      {project.team.map((member) => (
                        <li key={member} className="text-sm">{member}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <h3 className="font-display font-semibold mb-2">
                  Interested in a similar project?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let&apos;s discuss your vision and create something extraordinary together.
                </p>
                <Button asChild className="w-full">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
