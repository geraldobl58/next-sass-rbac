import Image from 'next/image'

import { Slash } from 'lucide-react'

import { ability } from '@/auth/auth'

import logoIcon from '@/assets/logo.svg'

import { ProfileButton } from './profile-button'
import { OrganizationSwitcher } from './organization-switcher'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme-switcher'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b">
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

        {permissions?.can('get', 'Project') && (
          <>
            <p>Projects</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
