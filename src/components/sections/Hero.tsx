'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/constants/animations'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
          alt="Modern architecture building"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl"
        >
          <motion.p
            variants={staggerItem}
            className="text-accent font-medium tracking-widest uppercase mb-4"
          >
            Award-Winning Architecture Studio
          </motion.p>

          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Designing Spaces That{' '}
            <span className="text-accent">Inspire</span> and{' '}
            <span className="text-accent">Endure</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
          >
            We create architectural masterpieces that blend innovation with timeless elegance,
            transforming visions into extraordinary living and working environments.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="group">
              <Link href="/projects">
                Explore Projects
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
