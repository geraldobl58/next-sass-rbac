import { AbilityBuilder } from '@casl/ability'
import { User } from './models/user'
import { Roles } from './roles'
import { AppAbility } from '.'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Roles, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', 'all') // Admins can manage everything
  },
  MEMBER(_, { can }) {
    // can('invite', 'User') // Members can invite users
    can('manage', 'Project') // Members can manage projects
  },
  BILLING(_, { can }) {
    // can('manage', 'Billing') // Billing users can manage billing
  },
}
