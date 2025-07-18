import { defineAbilityFor, Roles, userSchema } from '@sass/auth'

export function getUserPermissions(userId: string, role: Roles) {
  const authUser = userSchema.parse({
    id: userId,
    role: role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
