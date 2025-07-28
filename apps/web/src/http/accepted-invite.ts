import { api } from './api-client'

export async function acceptedInvite(invitedId: string) {
  await api.post(`invites/${invitedId}/accept`)
}
