import { ability } from '@/auth/auth'

import { ProjectForm } from './project-form'
import { redirect } from 'next/navigation'

export default async function CreateProject() {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    redirect(`/`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Project</h1>
      <ProjectForm />
    </div>
  )
}
