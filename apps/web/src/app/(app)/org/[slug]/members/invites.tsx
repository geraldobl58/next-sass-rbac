import { ability, getCurrentOrg } from '@/auth/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getInvites } from '@/http/get-invites'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { XOctagon } from 'lucide-react'
import { RevokeInviteButton } from './revoke-invite-button'

export async function Invites() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const { invites } = await getInvites(currentOrg!)

  return (
    <div className="space-y-4">
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Invites</h2>

        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map((invite) => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <span className="text-muted-foreground">
                        {invite.email}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      {invite.role}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permissions?.can('delete', 'Invite') && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {invites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-4 text-center">
                    No invites found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
