'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { NAV_LINKS } from '@/constants/navigation'
import { cn } from '@/lib/utils'

function HeaderContent() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Don't show header on admin pages or login page
  const isAdminPage = pathname?.startsWith('/admin')
  const isLoginPage = pathname === '/login'

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  // Hide header on admin and login pages
  if (isAdminPage || isLoginPage) {
    return null
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold tracking-tight">
              Archi<span className="text-accent">Core</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent relative',
                  pathname === link.href
                    ? 'text-accent'
                    : 'text-foreground/80'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/* Auth buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : session?.user ? (
                <div className="flex items-center space-x-2">
                  {/* Admin link for admin/editor */}
                  {(session.user.role === 'admin' || session.user.role === 'editor') && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block py-2 px-4 rounded-md text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-accent/10 text-accent'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Links */}
              <div className="border-t border-border pt-2 mt-2">
                {session?.user ? (
                  <>
                    {(session.user.role === 'admin' || session.user.role === 'editor') && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 py-2 px-4 rounded-md text-base font-medium hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full py-2 px-4 rounded-md text-base font-medium hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 py-2 px-4 rounded-md text-base font-medium hover:bg-muted transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Header() {
  return (
    <SessionProvider>
      <HeaderContent />
    </SessionProvider>
  )
}
