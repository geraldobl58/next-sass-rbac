'use server'

import { redirect } from 'next/navigation'

import { HTTPError } from 'ky'

import { z } from 'zod'

import { createOrganization } from '@/http/create-oganization'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Please, incluide at least 4 characters.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }

          return true
        },
        {
          message: 'Please, enter a valid domain.',
        }
      ),
    shouldAttachUserByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUserByDomain === true && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'Domain is required when auto-join is enabled.',
      path: ['domain'],
    }
  )

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
