import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, User, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { ProjectInterestForm } from '@/components/projects/ProjectInterestForm'
import { connectToDatabase } from '@/lib/mongodb'
import type { Project } from '@/types'

interface Props {
  params: { slug: string }
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const db = await connectToDatabase()
    const project = await db.collection('projects').findOne({
      slug,
      status: 'published'
    })
    return project as Project | null
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.title} | ArchiCore`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug)

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
            {project.images && project.images.length > 0 ? (
              <ProjectGallery images={project.images} title={project.title || ''} />
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
              </div>
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
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">
                          {project.location.city}, {project.location.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.year && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-medium">{project.year}</p>
                      </div>
                    </div>
                  )}

                  {project.architect && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Architect</p>
                        <p className="font-medium">{project.architect}</p>
                      </div>
                    </div>
                  )}

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
                {project.category && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <Badge variant="accent" className="capitalize">
                      {project.category}
                    </Badge>
                  </div>
                )}

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

              <ProjectInterestForm
                projectId={project._id?.toString()}
                projectSlug={project.slug}
                projectTitle={project.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
