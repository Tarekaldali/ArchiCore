'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Lock, Mail, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const callbackUrl = searchParams.get('callbackUrl')

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Redirect if already logged in based on role
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (session.user.permissions?.includes('view_dashboard')) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [status, session, router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setIsLoading(false)
      } else {
        // Fetch session to get user role for redirect
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()

        if (sessionData?.user) {
          if (callbackUrl) {
            router.push(callbackUrl)
          } else if (sessionData.user.permissions?.includes('view_dashboard')) {
            router.push('/admin')
          } else {
            router.push('/')
          }
        }
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}

function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-display font-bold">
                Archi<span className="text-accent">Core</span>
              </h1>
            </Link>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          <Suspense fallback={<div className="animate-pulse h-40 bg-muted rounded-md" />}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/register" className="text-accent hover:underline">
              Register
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginContent />
    </SessionProvider>
  )
}
