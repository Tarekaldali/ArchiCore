import { Hero } from '@/components/sections/Hero'
import { BrandIntro } from '@/components/sections/BrandIntro'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { Statistics } from '@/components/sections/Statistics'
import { CallToAction } from '@/components/sections/CallToAction'
import { connectToDatabase } from '@/lib/mongodb'

interface HomeContent {
  heroBadge?: string
  heroTitle?: string
  heroSubtitle?: string
  introTitle?: string
  introText?: string
}

async function getHomeContent(): Promise<HomeContent> {
  try {
    const db = await connectToDatabase()
    const item = await db.collection('content').findOne({ key: 'home' })
    return (item?.value || {}) as HomeContent
  } catch (error) {
    console.error('Error loading home content:', error)
    return {}
  }
}

export default async function HomePage() {
  const content = await getHomeContent()

  return (
    <>
      <Hero
        badge={content.heroBadge}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <BrandIntro
        title={content.introTitle}
        text={content.introText}
      />
      <FeaturedProjects />
      <Statistics />
      <CallToAction />
    </>
  )
}
