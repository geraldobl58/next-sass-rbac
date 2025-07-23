import { Roles } from '@sass/auth'

import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Roles
    userId: string
    organizationId: string
  }
}

export async function getMembership(org: string) {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()

  return result
}
