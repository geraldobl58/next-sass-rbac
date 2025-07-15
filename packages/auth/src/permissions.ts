import { AbilityBuilder } from '@casl/ability'
import { User } from './models/user'
import { Roles } from './roles'
import { AppAbility } from '.'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Roles, PermissionsByRole> = {
  ADMIN(_, { can }) {},
  MEMBER(user, { can }) {},
  BILLING(_, { can }) {},
}
