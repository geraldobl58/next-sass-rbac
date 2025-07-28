import Link from 'next/link'
import Image from 'next/image'

import { Slash } from 'lucide-react'

import { ability } from '@/auth/auth'

import logoIcon from '@/assets/logo.svg'

import { ProfileButton } from './profile-button'
import { OrganizationSwitcher } from './organization-switcher'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme-switcher'
import { ProjectSwitcher } from './project-switcher'
import { PendingInvites } from './pending-invites'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between pb-2">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image
            src={logoIcon}
            alt="Logo"
            width={40}
            height={40}
            className="size-6 dark:invert"
          />
        </Link>

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="text-border size-3 -rotate-[24deg]" />

            <ProjectSwitcher />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <PendingInvites />
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
