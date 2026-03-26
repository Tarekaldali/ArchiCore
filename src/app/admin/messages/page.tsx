'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  MessageSquare,
  Mail,
  Phone,
  Building,
  Calendar,
  Trash2,
  Check,
  Eye,
  RefreshCw
} from 'lucide-react'

interface Message {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  projectType?: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  replied: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  archived: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

export default function MessagesPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filter, setFilter] = React.useState('all')
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/messages${params}`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMessages()
  }, [filter])

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (response.ok) {
        setMessages(messages.map(m =>
          m._id === id ? { ...m, status: status as Message['status'] } : m
        ))
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessages(messages.filter(m => m._id !== id))
        if (selectedMessage?._id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const newCount = messages.filter(m => m.status === 'new').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions {newCount > 0 && `(${newCount} new)`}
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'new', 'read', 'replied', 'archived'].map(status => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-1 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </CardContent>
            </Card>
          ) : (
            messages.map(message => (
              <Card
                key={message._id}
                className={`cursor-pointer transition-colors hover:border-accent ${
                  selectedMessage?._id === message._id ? 'border-accent' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(message)
                  if (message.status === 'new') {
                    updateStatus(message._id, 'read')
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium truncate">{message.name}</p>
                    <Badge className={STATUS_COLORS[message.status]}>
                      {message.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {message.email}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedMessage.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(selectedMessage._id, 'replied')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Mark Replied
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(selectedMessage._id, 'archived')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Archive
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMessage(selectedMessage._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-accent hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  {selectedMessage.company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedMessage.company}</span>
                    </div>
                  )}
                  {selectedMessage.projectType && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{selectedMessage.projectType}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-medium mb-2">No message selected</p>
                <p className="text-muted-foreground">
                  Select a message from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
