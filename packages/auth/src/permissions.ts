import { AbilityBuilder } from '@casl/ability'
import { User } from './models/user'
import { AppAbility } from '.'

type Role = 'ADMIN' | 'MEMBER'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', 'all') // Admins can manage everything
  },
  MEMBER(_, { can }) {
    can('invite', 'User') // Members can invite users
    can('manage', 'Project') // Members can manage projects
  },
}
