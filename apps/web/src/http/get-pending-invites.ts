import { Roles } from '@sass/auth'
import { api } from './api-client'

interface GetPendingInvitesResponse {
  invites: {
    id: string
    role: Roles
    email: string
    createdAt: string
    organization: {
      name: string
    }
    author: {
      id: string
      name: string | null
      avatarUrl: string
    } | null
  }[]
}

export async function getPendingInvites() {
  const result = await api
    .get(`pending-invites`)
    .json<GetPendingInvitesResponse>()

  return result
}
