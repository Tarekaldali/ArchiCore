'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { Shield, UserCheck, UserX, RefreshCw, Plus } from 'lucide-react'
import type { User } from '@/types'

interface RoleItem {
  _id: string
  name: string
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  viewer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const DEFAULT_NEW_USER = {
  name: '',
  email: '',
  password: '',
  role: 'viewer',
}

export default function UsersManagementPage() {
  const { data: session } = useSession()
  const toast = useToast()
  const [users, setUsers] = React.useState<Omit<User, 'password'>[]>([])
  const [roles, setRoles] = React.useState<RoleItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [updating, setUpdating] = React.useState<string | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)
  const [newUser, setNewUser] = React.useState(DEFAULT_NEW_USER)

  const canManageUsers = session?.user?.permissions?.includes('manage_users')

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/roles'),
      ])
      const usersData = await usersResponse.json()
      const rolesData = await rolesResponse.json()

      if (usersData.users) {
        setUsers(usersData.users)
      }
      if (rolesData.roles) {
        setRoles(rolesData.roles)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    if (canManageUsers) {
      fetchUsers()
    }
  }, [canManageUsers, fetchUsers])

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(userId)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to update user role')
        return
      }

      setUsers((prev) =>
        prev.map((user) => (user._id?.toString() === userId ? { ...user, role: newRole } : user))
      )
      toast.success('User role updated')
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
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
        body: JSON.stringify({ isActive: !isActive }),
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to update user')
        return
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id?.toString() === userId ? { ...user, isActive: !isActive } : user
        )
      )
      toast.success('User status updated')
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    } finally {
      setUpdating(null)
    }
  }

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill all fields')
      return
    }

    setUpdating('create')
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to create user')
        return
      }

      toast.success('User created successfully')
      setNewUser(DEFAULT_NEW_USER)
      setIsCreating(false)
      fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    } finally {
      setUpdating(null)
    }
  }

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You do not have permission to manage users.
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
          <h1 className="text-3xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and assigned roles.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreating((prev) => !prev)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createUser} disabled={updating === 'create'}>
                {updating === 'create' ? 'Creating...' : 'Create User'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setNewUser(DEFAULT_NEW_USER)
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-16 bg-muted rounded animate-pulse" />
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
                        {!user.isActive && <Badge variant="secondary" className="text-xs">Disabled</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={ROLE_COLORS[user.role] || ''}>{user.role}</Badge>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id!.toString(), e.target.value)}
                      disabled={updating === user._id?.toString() || user.email === session?.user?.email}
                      className="px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {roles.map((role) => (
                        <option key={role._id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
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
