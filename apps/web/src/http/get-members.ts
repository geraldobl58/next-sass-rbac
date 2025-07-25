import { Roles } from '@sass/auth'

import { api } from './api-client'

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    role: Roles
    name: string
    avatarUrl: string | null
    email: string
  }[]
}

export async function getMembers(org: string) {
  const result = await api
    .get(`organizations/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<GetMembersResponse>()

  return result
}
