'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, staggerItem } from '@/constants/animations'
import { Linkedin, Twitter, Mail } from 'lucide-react'

const TEAM_MEMBERS = [
  {
    name: 'Marcus Chen',
    role: 'Principal Architect & Founder',
    bio: 'With over 20 years of experience, Marcus leads ArchiCore with a vision for sustainable, human-centric design.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    social: { linkedin: '#', twitter: '#', email: 'marcus@archicore.com' }
  },
  {
    name: 'Sarah Walsh',
    role: 'Design Director',
    bio: 'Sarah brings 15 years of award-winning residential design experience to every project.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    social: { linkedin: '#', twitter: '#', email: 'sarah@archicore.com' }
  },
  {
    name: 'David Okonkwo',
    role: 'Commercial Projects Lead',
    bio: 'David specializes in large-scale commercial and mixed-use developments across Asia and Europe.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    social: { linkedin: '#', twitter: '#', email: 'david@archicore.com' }
  },
  {
    name: 'Elena Rodriguez',
    role: 'Sustainability Consultant',
    bio: 'Elena ensures all projects meet the highest environmental standards and certifications.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    social: { linkedin: '#', twitter: '#', email: 'elena@archicore.com' }
  },
  {
    name: 'James Rivera',
    role: 'Urban Planning Specialist',
    bio: 'James leads masterplanning initiatives that transform communities and create lasting impact.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    social: { linkedin: '#', twitter: '#', email: 'james@archicore.com' }
  },
  {
    name: 'Yuki Tanaka',
    role: 'Interior Design Lead',
    bio: 'Yuki creates interiors that seamlessly blend functionality with minimalist aesthetics.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    social: { linkedin: '#', twitter: '#', email: 'yuki@archicore.com' }
  }
]

const AWARDS = [
  { year: 2024, title: 'AIA Honor Award', project: 'Azure Cliff Residence' },
  { year: 2023, title: 'World Architecture Festival Winner', project: 'Vertex Tower' },
  { year: 2023, title: 'RIBA International Prize Shortlist', project: 'Garden District' },
  { year: 2022, title: 'Green Building Award', project: 'Eco Campus Phase I' },
  { year: 2022, title: 'Interior Design Best of Year', project: 'Minimalist Penthouse' },
]

export default function AboutPage() {
  const heroRef = React.useRef(null)
  const teamRef = React.useRef(null)
  const valuesRef = React.useRef(null)
  const awardRef = React.useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' })
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' })
  const awardInView = useInView(awardRef, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section ref={heroRef} className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={heroInView ? 'animate' : 'initial'}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.p
                variants={staggerItem}
                className="text-accent font-medium tracking-widest uppercase mb-4"
              >
                About Us
              </motion.p>
              <motion.h1
                variants={staggerItem}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
              >
                Crafting Tomorrow&apos;s <span className="text-accent">Architecture</span> Today
              </motion.h1>
              <motion.p
                variants={staggerItem}
                className="text-lg text-muted-foreground leading-relaxed mb-6"
              >
                Founded in 2010, ArchiCore has grown from a small studio into an internationally
                recognized architecture practice. Our multidisciplinary team of 50+ architects,
                designers, and sustainability experts work together to create spaces that inspire,
                endure, and respect our environment.
              </motion.p>
              <motion.p
                variants={staggerItem}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                We believe that great architecture is born from the intersection of bold vision,
                meticulous craftsmanship, and deep respect for the communities we serve. Every
                project is an opportunity to push boundaries while honoring context and heritage.
              </motion.p>
            </div>

            <motion.div
              variants={staggerItem}
              className="relative aspect-[4/5] rounded-lg overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
                alt="ArchiCore Studio"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={valuesInView ? 'animate' : 'initial'}
            className="text-center mb-12"
          >
            <motion.p
              variants={staggerItem}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              Our Philosophy
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              Values That Guide Us
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={valuesInView ? 'animate' : 'initial'}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Innovation',
                description: 'We embrace cutting-edge technologies and design methodologies to create forward-thinking solutions.'
              },
              {
                title: 'Sustainability',
                description: 'Environmental responsibility is at the core of every design decision we make.'
              },
              {
                title: 'Collaboration',
                description: 'We work closely with clients, communities, and consultants to achieve exceptional results.'
              }
            ].map((value) => (
              <motion.div
                key={value.title}
                variants={staggerItem}
                className="text-center p-8 rounded-lg bg-muted/50"
              >
                <h3 className="text-xl font-display font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={teamInView ? 'animate' : 'initial'}
            className="text-center mb-12"
          >
            <motion.p
              variants={staggerItem}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              Our Team
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              Meet the People Behind ArchiCore
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={teamInView ? 'animate' : 'initial'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                key={member.name}
                variants={staggerItem}
                className="bg-background rounded-lg overflow-hidden border border-border group"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold">{member.name}</h3>
                  <p className="text-accent text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex gap-2">
                    <a
                      href={member.social.linkedin}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Awards */}
      <section ref={awardRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={awardInView ? 'animate' : 'initial'}
          >
            <motion.div variants={staggerItem} className="text-center mb-12">
              <p className="text-accent font-medium tracking-widest uppercase mb-4">
                Recognition
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Awards & Accolades
              </h2>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="max-w-3xl mx-auto space-y-4"
            >
              {AWARDS.map((award, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="accent">{award.year}</Badge>
                    <div>
                      <p className="font-medium">{award.title}</p>
                      <p className="text-sm text-muted-foreground">{award.project}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
