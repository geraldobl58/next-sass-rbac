import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProjectList } from './project-list'

export default async function Projects() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button asChild size="sm">
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="mr-2 size-4" />
              Create Project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
        <div className="text-muted-foreground text-sm">
          <p>You do not have permission to view projects.</p>
        </div>
      )}
    </div>
  )
}
