'use server'

import { revalidateTag } from 'next/cache'

import { acceptedInvite } from '@/http/accepted-invite'
import { rejectInvite } from '@/http/reject-invite'

export async function acceptInviteAction(inviteId: string) {
  await acceptedInvite(inviteId)

  revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)

  revalidateTag('organizations')
}
