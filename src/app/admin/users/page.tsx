'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Shield, UserCheck, UserX, RefreshCw } from 'lucide-react'
import type { User, UserRole } from '@/types'

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  viewer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export default function UsersManagementPage() {
  const { data: session } = useSession()
  const [users, setUsers] = React.useState<Omit<User, 'password'>[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [updating, setUpdating] = React.useState<string | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUpdating(userId)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        setUsers(users.map(user =>
          user._id?.toString() === userId ? { ...user, role: newRole } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setUpdating(null)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    setUpdating(userId)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        setUsers(users.map(user =>
          user._id?.toString() === userId ? { ...user, isActive: !isActive } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setUpdating(null)
    }
  }

  // Check if current user is admin
  if (session?.user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don&apos;t have permission to access this page.
              Only administrators can manage users.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage user roles and access</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id?.toString()}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        {!user.isActive && (
                          <Badge variant="secondary" className="text-xs">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id!.toString(), e.target.value as UserRole)}
                      disabled={updating === user._id?.toString() || user.email === session?.user?.email}
                      className="px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>

                    <Button
                      variant={user.isActive ? 'outline' : 'secondary'}
                      size="sm"
                      onClick={() => toggleUserStatus(user._id!.toString(), user.isActive)}
                      disabled={updating === user._id?.toString() || user.email === session?.user?.email}
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="w-4 h-4 mr-1" />
                          Disable
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
