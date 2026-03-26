'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { AVAILABLE_PERMISSIONS, type Permission } from '@/types/role'
import { Shield, Plus, Save, Trash2, Pencil, RefreshCw } from 'lucide-react'

interface RoleRecord {
  _id: string
  name: string
  permissions: Permission[]
}

const DEFAULT_FORM = {
  name: '',
  permissions: ['view_dashboard'] as Permission[],
}

export default function RolesPermissionsPage() {
  const { data: session } = useSession()
  const toast = useToast()
  const [roles, setRoles] = React.useState<RoleRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState(DEFAULT_FORM)

  const canManageRoles = session?.user?.permissions?.includes('manage_roles')

  const fetchRoles = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/roles')
      const data = await response.json()
      if (data.roles) {
        setRoles(data.roles)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('Failed to fetch roles')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    if (canManageRoles) {
      fetchRoles()
    }
  }, [canManageRoles, fetchRoles])

  const togglePermission = (permission: Permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((item) => item !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const handleEdit = (role: RoleRecord) => {
    setEditingId(role._id)
    setForm({
      name: role.name,
      permissions: role.permissions,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
  }

  const saveRole = async () => {
    if (!form.name.trim()) {
      toast.error('Role name is required')
      return
    }
    if (form.permissions.length === 0) {
      toast.error('Select at least one permission')
      return
    }

    setIsSaving(true)
    try {
      const url = editingId ? `/api/roles/${editingId}` : '/api/roles'
      const method = editingId ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim().toLowerCase(),
          permissions: form.permissions,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to save role')
        return
      }

      toast.success(editingId ? 'Role updated successfully' : 'Role created successfully')
      resetForm()
      fetchRoles()
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error('Failed to save role')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteRole = async (role: RoleRecord) => {
    if (!confirm(`Delete role "${role.name}"?`)) return

    try {
      const response = await fetch(`/api/roles/${role._id}`, { method: 'DELETE' })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to delete role')
        return
      }

      toast.success('Role deleted successfully')
      if (editingId === role._id) {
        resetForm()
      }
      fetchRoles()
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error('Failed to delete role')
    }
  }

  if (!canManageRoles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You do not have permission to manage roles.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Create roles and define permission scopes.
          </p>
        </div>
        <Button onClick={fetchRoles} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Role' : 'Create Role'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Role Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="example: content_manager"
          />

          <div>
            <p className="text-sm font-medium mb-3">Permissions</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <label
                  key={permission}
                  className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="rounded border-border"
                  />
                  <span>{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveRole} disabled={isSaving}>
              {editingId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {isSaving ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles ({roles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <p className="text-muted-foreground text-sm">No roles found.</p>
          ) : (
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role._id}
                  className="rounded-lg border border-border p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold capitalize">{role.name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRole(role)}
                      disabled={['admin', 'editor', 'viewer'].includes(role.name)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
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
