import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  FolderKanban,
  Users,
  MessageSquare,
  Inbox,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { connectToDatabase } from '@/lib/mongodb'

interface ActivityItem {
  id: string
  type: 'project' | 'message' | 'submission'
  title: string
  subtitle: string
  createdAt: Date
}

function formatRelativeDate(input?: Date | string): string {
  if (!input) return 'Recently'
  const date = new Date(input)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

async function getDashboardData() {
  const db = await connectToDatabase()

  const [projects, team, messages, submissions, latestProjects, latestMessages, latestSubmissions] =
    await Promise.all([
      db.collection('projects').countDocuments(),
      db.collection('team').countDocuments({ isActive: true }),
      db.collection('contacts').countDocuments(),
      db.collection('submissions').countDocuments(),
      db.collection('projects').find({}).sort({ createdAt: -1 }).limit(2).toArray(),
      db.collection('contacts').find({}).sort({ createdAt: -1 }).limit(2).toArray(),
      db.collection('submissions').find({}).sort({ createdAt: -1 }).limit(2).toArray(),
    ])

  const activities: ActivityItem[] = [
    ...latestProjects.map((item) => ({
      id: `project-${item._id}`,
      type: 'project' as const,
      title: 'Project created',
      subtitle: item.title || 'Untitled project',
      createdAt: item.createdAt as Date,
    })),
    ...latestMessages.map((item) => ({
      id: `message-${item._id}`,
      type: 'message' as const,
      title: 'New contact message',
      subtitle: item.email || 'Unknown sender',
      createdAt: item.createdAt as Date,
    })),
    ...latestSubmissions.map((item) => ({
      id: `submission-${item._id}`,
      type: 'submission' as const,
      title: 'Project interest submission',
      subtitle: item.projectTitle || item.projectSlug || 'General inquiry',
      createdAt: item.createdAt as Date,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return {
    stats: {
      projects,
      team,
      messages,
      submissions,
    },
    activities,
  }
}

export default async function AdminDashboard() {
  const { stats, activities } = await getDashboardData()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to ArchiCore admin</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.projects}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/projects" className="text-accent hover:underline">
                View all &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.team}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/team" className="text-accent hover:underline">
                Manage team &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.messages}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/messages" className="text-accent hover:underline">
                Open inbox &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Submissions
            </CardTitle>
            <Inbox className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.submissions}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/submissions" className="text-accent hover:underline">
                View all &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/admin/projects/new">
                Add New Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/admin/users">
                Manage Users
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/admin/roles">
                Roles & Permissions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/" target="_blank">
                View Website
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity yet.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div
                      className={[
                        'w-2 h-2 rounded-full',
                        activity.type === 'project'
                          ? 'bg-green-500'
                          : activity.type === 'message'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500',
                      ].join(' ')}
                    />
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.subtitle} - {formatRelativeDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
