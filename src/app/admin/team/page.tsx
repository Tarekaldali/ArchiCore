'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  RefreshCw,
  Mail,
  GripVertical
} from 'lucide-react'

interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  image: {
    url: string
    publicId: string
  }
  email?: string
  socialLinks?: {
    linkedin?: string
    instagram?: string
    twitter?: string
  }
  order: number
  isActive: boolean
}

const EMPTY_MEMBER: Partial<TeamMember> = {
  name: '',
  role: '',
  bio: '',
  image: { url: '', publicId: '' },
  email: '',
  order: 0,
  isActive: true
}

export default function TeamPage() {
  const [members, setMembers] = React.useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [editingMember, setEditingMember] = React.useState<Partial<TeamMember> | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/team')
      const data = await response.json()
      if (data.members) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMembers()
  }, [])

  const saveMember = async () => {
    if (!editingMember) return

    try {
      const isNew = !editingMember._id
      const url = '/api/team'
      const method = isNew ? 'POST' : 'PUT'

      // Provide defaults for required fields
      const memberData = {
        ...editingMember,
        order: editingMember.order || members.length,
        image: editingMember.image?.url ? editingMember.image : {
          url: `https://ui-avatars.com/api/?name=${encodeURIComponent(editingMember.name || 'T')}&background=random`,
          publicId: `avatar_${Date.now()}`
        }
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? memberData : { id: editingMember._id, ...memberData })
      })

      if (response.ok) {
        fetchMembers()
        setEditingMember(null)
        setIsCreating(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save team member')
      }
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Failed to save team member')
    }
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const response = await fetch(`/api/team?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMembers(members.filter(m => m._id !== id))
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  const toggleActive = async (member: TeamMember) => {
    try {
      const response = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: member._id, isActive: !member.isActive })
      })

      if (response.ok) {
        setMembers(members.map(m =>
          m._id === member._id ? { ...m, isActive: !m.isActive } : m
        ))
      }
    } catch (error) {
      console.error('Error updating team member:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">Manage your team members</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchMembers} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => {
            setEditingMember(EMPTY_MEMBER)
            setIsCreating(true)
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingMember && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isCreating ? 'Add New Member' : 'Edit Member'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={editingMember.name || ''}
                onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                placeholder="John Doe"
              />
              <Input
                label="Role"
                value={editingMember.role || ''}
                onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                placeholder="Principal Architect"
              />
            </div>

            <Textarea
              label="Bio"
              value={editingMember.bio || ''}
              onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
              placeholder="Brief biography..."
              rows={3}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={editingMember.email || ''}
                onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                placeholder="john@archicore.com"
              />
              <Input
                label="Image URL"
                value={editingMember.image?.url || ''}
                onChange={e => setEditingMember({
                  ...editingMember,
                  image: { url: e.target.value, publicId: editingMember.image?.publicId || '' }
                })}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveMember}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingMember(null)
                setIsCreating(false)
              }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team list */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">No team members yet</p>
            <p className="text-muted-foreground mb-4">
              Add your first team member to get started
            </p>
            <Button onClick={() => {
              setEditingMember(EMPTY_MEMBER)
              setIsCreating(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <Card key={member._id} className={!member.isActive ? 'opacity-50' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {member.image?.url ? (
                      <img
                        src={member.image.url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      {!member.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-accent mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {member.bio}
                    </p>
                    {member.email && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingMember(member)
                      setIsCreating(false)
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(member)}
                  >
                    {member.isActive ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMember(member._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
