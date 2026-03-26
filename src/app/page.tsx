import { Hero } from '@/components/sections/Hero'
import { BrandIntro } from '@/components/sections/BrandIntro'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { Statistics } from '@/components/sections/Statistics'
import { CallToAction } from '@/components/sections/CallToAction'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <FeaturedProjects />
      <Statistics />
      <CallToAction />
    </>
  )
}
