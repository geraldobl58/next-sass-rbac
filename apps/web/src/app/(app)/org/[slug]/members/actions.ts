'use server'
import { revalidateTag } from 'next/cache'

import z from 'zod'

import { Roles, rolesSchema } from '@sass/auth'

import { getCurrentOrg } from '@/auth/auth'

import { removeMember } from '@/http/remove-member'
import { updateMember } from '@/http/update-member'
import { revokeInvite } from '@/http/revoke-invite'
import { createInvite } from '@/http/create-invite'
import { HTTPError } from 'ky'

const inviteSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  role: rolesSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data.entries()))

  const currentOrg = await getCurrentOrg()

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, role } = result.data

  try {
    await createInvite({
      org: currentOrg!,
      email,
      role,
    })

    revalidateTag(`${currentOrg}/invites`)
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
    message: 'Invite created successfully.',
    errors: null,
  }
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({
    org: currentOrg!,
    memberId,
  })

  revalidateTag(`${currentOrg}/members`)
}

export async function updateMemberAction(memberId: string, role: Roles) {
  const currentOrg = await getCurrentOrg()

  await updateMember({
    org: currentOrg!,
    memberId,
    role,
  })

  revalidateTag(`${currentOrg}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg()

  await revokeInvite({
    org: currentOrg!,
    inviteId,
  })

  revalidateTag(`${currentOrg}/invites`)
}
