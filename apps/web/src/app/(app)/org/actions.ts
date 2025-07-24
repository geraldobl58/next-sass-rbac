'use server'

import { HTTPError } from 'ky'

import { createOrganization } from '@/http/create-oganization'
import { updateOrganization } from '@/http/update-organization'
import { getCurrentOrg } from '@/auth/auth'
import { organizationSchema } from '@/schemas/organization'
import { revalidateTag } from 'next/cache'

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(
    Object.fromEntries(data.entries())
  )

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUserByDomain } = result.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUserByDomain,
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
    message: 'Organization created successfully.',
    errors: null,
  }
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const result = organizationSchema.safeParse(
    Object.fromEntries(data.entries())
  )

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUserByDomain } = result.data

  try {
    await updateOrganization({
      org: currentOrg!,
      name,
      domain,
      shouldAttachUserByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Organization created successfully.',
    errors: null,
  }
}
