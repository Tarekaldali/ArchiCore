'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/constants/animations'

export function BrandIntro() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Text content */}
          <div>
            <motion.p
              variants={staggerItem}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              About ArchiCore
            </motion.p>

            <motion.h2
              variants={staggerItem}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6"
            >
              Where Vision Meets{' '}
              <span className="text-accent">Architectural Excellence</span>
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="text-muted-foreground text-lg leading-relaxed mb-6"
            >
              Founded in 2010, ArchiCore has established itself as a leading force in
              contemporary architecture. Our multidisciplinary team combines innovative
              design thinking with sustainable practices to create spaces that stand
              the test of time.
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              From sleek urban high-rises to intimate residential retreats, we approach
              each project with the same commitment to excellence, craftsmanship, and
              attention to detail that defines our studio&apos;s philosophy.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-wrap gap-8"
            >
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-accent">15+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-accent">200+</p>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-accent">25+</p>
                <p className="text-sm text-muted-foreground">Design Awards</p>
              </div>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            variants={staggerItem}
            className="relative aspect-[4/5] lg:aspect-auto lg:h-[600px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
              alt="ArchiCore Studio"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
