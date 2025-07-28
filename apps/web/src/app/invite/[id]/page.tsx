import { auth, isAuthenticated } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptedInvite } from '@/http/accepted-invite'
import { getInvite } from '@/http/get-invite'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LogIn, LogOutIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id

  const { invite } = await getInvite(inviteId)
  const isUserAuthenticated = await isAuthenticated()

  let currentUserEmail = null

  if (isUserAuthenticated) {
    const { user } = await auth()

    currentUserEmail = user.email
  }

  const userIsAuthenticatedWithSameEmailFromInvite = (await isAuthenticated())
    ? currentUserEmail === invite.email
    : false

  async function signInFromInvite() {
    const cookieStore = await cookies()

    cookieStore.set('inviteId', inviteId)

    redirect(`/auth/sign-in?${invite.email}`)
  }

  async function acceptInviteAction() {
    await acceptedInvite(inviteId)

    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage
                src={invite.author.avatarUrl}
                alt={invite.author.name ?? 'User Avatar'}
              />
            )}
            <AvatarFallback />
          </Avatar>

          <p className="text-muted-foreground flex flex-col text-center leading-relaxed text-balance">
            <span className="text-medium text-foreground">
              {invite.author?.name ?? 'Someone'} invited you to join{' '}
            </span>
            <span className="text-medium text-foreground">
              {invite.organization.name}
            </span>
            <span>{dayjs(invite.createdAt).fromNow()}</span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="mr-2 size-4" />
              Sign in to accept invite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircle className="mr-2 size-4" />
              Join {invite.organization.name} Accept invite
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center text-sm leading-relaxed text-balance">
              This invite was sent to{' '}
              <span className="text-foreground font-medium">
                {invite.email}
              </span>
              , but you are currently signed in with{' '}
              <span className="text-foreground font-medium">
                {currentUserEmail}
              </span>
              .
            </p>

            <div className="space-y-2">
              <Button asChild variant="secondary" className="w-full">
                <a href="/api/auth/sign-out">
                  <LogOutIcon className="mr-2 size-4" />
                  Sign out from {currentUserEmail}
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
