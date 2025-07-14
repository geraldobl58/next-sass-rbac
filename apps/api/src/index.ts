import { defineAbilityFor } from '@sass/auth'

const ability = defineAbilityFor({
  role: 'MEMBER',
})

const userCan = ability.can('invite', 'User')
const useCanDelete = ability.can('delete', 'User')

console.log(userCan)

console.log(useCanDelete)
