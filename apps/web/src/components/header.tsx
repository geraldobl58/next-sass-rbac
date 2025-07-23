import Image from 'next/image'

import logoIcon from '@/assets/logo.svg'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={logoIcon}
          alt="Logo"
          width={40}
          height={40}
          className="size-6 dark:invert"
        />

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />
      </div>
      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
