import type { TeamMember } from '@/types'

export const seedTeam: Omit<TeamMember, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Marcus Chen',
    role: 'Principal Architect & Founder',
    bio: 'With over 20 years of experience, Marcus leads ArchiCore with a vision for sustainable, human-centric design. His work has been recognized with numerous international awards.',
    image: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      publicId: 'team-marcus'
    },
    email: 'marcus@archicore.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marcuschen',
      twitter: 'https://twitter.com/marcuschen'
    },
    order: 1,
    isActive: true
  },
  {
    name: 'Sarah Walsh',
    role: 'Design Director',
    bio: 'Sarah brings 15 years of award-winning residential design experience to every project. Her approach balances aesthetic innovation with practical livability.',
    image: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      publicId: 'team-sarah'
    },
    email: 'sarah@archicore.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahwalsh',
      instagram: 'https://instagram.com/sarahwalsh'
    },
    order: 2,
    isActive: true
  },
  {
    name: 'David Okonkwo',
    role: 'Commercial Projects Lead',
    bio: 'David specializes in large-scale commercial and mixed-use developments across Asia and Europe. He is passionate about creating sustainable urban environments.',
    image: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      publicId: 'team-david'
    },
    email: 'david@archicore.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidokonkwo'
    },
    order: 3,
    isActive: true
  },
  {
    name: 'Elena Rodriguez',
    role: 'Sustainability Consultant',
    bio: 'Elena ensures all projects meet the highest environmental standards and certifications. She holds LEED AP and Passive House certifications.',
    image: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      publicId: 'team-elena'
    },
    email: 'elena@archicore.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/elenarodriguez',
      twitter: 'https://twitter.com/elenarodriguez'
    },
    order: 4,
    isActive: true
  },
  {
    name: 'James Rivera',
    role: 'Urban Planning Specialist',
    bio: 'James leads masterplanning initiatives that transform communities and create lasting impact. His work emphasizes pedestrian-friendly design and green infrastructure.',
    image: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      publicId: 'team-james'
    },
    email: 'james@archicore.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jamesrivera'
    },
    order: 5,
    isActive: true
  },
  {
    name: 'Yuki Tanaka',
    role: 'Interior Design Lead',
    bio: 'Yuki creates interiors that seamlessly blend functionality with minimalist aesthetics. Her work draws inspiration from Japanese design philosophy.',
    image: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      publicId: 'team-yuki'
    },
    email: 'yuki@archicore.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/yukitanaka',
      instagram: 'https://instagram.com/yukitanaka'
    },
    order: 6,
    isActive: true
  }
]
