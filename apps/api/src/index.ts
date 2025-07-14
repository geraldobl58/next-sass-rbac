import { ability } from '@sass/auth'

const userCan = ability.can('invite', 'User')
const useCanDelete = ability.can('delete', 'User')

console.log(userCan)

console.log(useCanDelete)
