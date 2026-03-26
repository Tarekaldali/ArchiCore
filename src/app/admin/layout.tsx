'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  UserCog,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ToastProvider } from '@/components/ui/Toast'
import type { UserRole } from '@/types'

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'viewer'] },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban, roles: ['admin', 'editor', 'viewer'] },
  { href: '/admin/team', label: 'Team', icon: Users, roles: ['admin'] },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, roles: ['admin', 'editor', 'viewer'] },
  { href: '/admin/users', label: 'Users', icon: UserCog, roles: ['admin'] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
]

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  viewer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const userRole = (session?.user?.role as UserRole) || 'viewer'

  // Filter nav items based on user role
  const filteredNav = ADMIN_NAV.filter(item =>
    item.roles.includes(userRole)
  )

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/admin" className="font-display font-bold text-lg">
          Archi<span className="text-accent">Core</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-40 transition-transform lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="hidden lg:flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
            <Link href="/admin" className="font-display font-bold text-lg truncate">
              Archi<span className="text-accent">Core</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="View Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          {/* Spacer for mobile */}
          <div className="h-16 lg:hidden flex-shrink-0" />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{session?.user?.name}</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full capitalize',
                    ROLE_COLORS[userRole]
                  )}>
                    {userRole}
                  </span>
                </div>
              </div>
              <ThemeToggle className="hidden lg:flex flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground mb-3 truncate">{session?.user?.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ToastProvider>
    </SessionProvider>
  )
}
