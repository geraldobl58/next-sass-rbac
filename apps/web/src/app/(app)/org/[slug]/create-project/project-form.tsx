'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { useFormState } from '@/hooks/use-form-state'

import { createProjectAction } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'
import { queryCLient } from '@/lib/react-query'

export function ProjectForm() {
  const { slug: org } = useParams<{ slug: string }>()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createProjectAction,
    () => {
      queryCLient.invalidateQueries({
        queryKey: [org, 'projects'],
      })
    }
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sucess</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="organization">Project Name</Label>
        <Input name="name" type="text" id="name" />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="organization">Description</Label>
        <Textarea name="description" id="description" />

        {errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save Project'
        )}
      </Button>
    </form>
  )
}
