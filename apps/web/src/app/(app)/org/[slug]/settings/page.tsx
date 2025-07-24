import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OrganizationForm } from '../../organization-form'
import { ShutdownOrganizationButton } from './shutdown-organization-button'
import { getOrganization } from '@/http/get-organization'

export default async function Settings() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  if (!currentOrg) {
    console.log('No current organization found.')
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>No current organization found.</p>
      </div>
    )
  }
  const { organization } = await getOrganization(currentOrg)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-6">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>Update organization details</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm
                isUpdatting
                initialData={{
                  name: organization.name,
                  domain: organization.domain,
                  shouldAttachUserByDomain:
                    organization.shouldAttachUserByDomain,
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {canGetBilling && (
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Billing management is not implemented yet.</p>
          </CardContent>
        </Card>
      )}

      {canShutdownOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown Organization</CardTitle>
            <CardDescription>
              Permanently delete this organization and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShutdownOrganizationButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
