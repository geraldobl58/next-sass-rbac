'use client'

import { useState } from 'react'

import { Check, UserPlus2, X } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingInvites } from '@/http/get-pending-invites'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">
            Pending invites ({data?.invites.length ?? 0})
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 space-y-2">
        <span className="block text-sm font-medium">
          Pending invites ({data?.invites.length ?? 0})
          {data?.invites.length === 0 && ' - No pending invites'}
        </span>

        {data?.invites.map((invite) => {
          return (
            <div className="space-y-2" key={invite.id}>
              <p className="text-muted-foreground flex flex-col leading-relaxed">
                <span className="text-medium text-foreground">
                  {invite.author?.name ?? 'Someone'}
                </span>
                <span className="text-medium text-foreground">
                  {invite.organization.name}
                </span>
                <span>{dayjs(invite.createdAt).fromNow()}</span>
              </p>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAcceptInvite(invite.id)}
                >
                  <Check className="mr-1.5 size-3" />
                  Accept
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => handleRejectInvite(invite.id)}
                >
                  <X className="mr-1.5 size-3" />
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
