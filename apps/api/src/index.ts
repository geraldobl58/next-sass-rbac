import { defineAbilityFor, projectSchema } from '@sass/auth'

const ability = defineAbilityFor({
  role: 'MEMBER',
  id: '12345',
})

const project = projectSchema.parse({ id: 'project-id', ownerId: '12345' })

console.log(ability.can('get', 'Billing'))
console.log(ability.can('create', 'Invite'))
console.log(ability.can('delete', project))
