'use server'

import { HTTPError } from 'ky'

import { z } from 'zod'
import { createProject } from '@/http/create-project'
import { getCurrentOrg } from '@/auth/auth'

const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please, incluide at least 4 characters.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data.entries()))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, description } = result.data

  try {
    const org = await getCurrentOrg()

    if (!org) {
      return {
        success: false,
        message: 'Organization not found.',
        errors: null,
      }
    }

    await createProject({
      org,
      name,
      description,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }
  }

  return {
    success: true,
    message: 'Project created successfully.',
    errors: null,
  }
}
