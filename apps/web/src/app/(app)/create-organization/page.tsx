import Link from 'next/link'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'

export default function CreateOrganization() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Organization</h1>

      <form className="space-y-4">
        {/* <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription></AlertDescription>
        </Alert> */}

        <div className="space-y-1">
          <Label htmlFor="organization">Organization Name</Label>
          <Input name="organization" type="text" id="organization" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="domain">Email Domain</Label>
          <Input
            name="domain"
            type="email"
            id="domain"
            inputMode="url"
            placeholder="example.com"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              id="shouldAttachUserByDomain"
              name="shouldAttachUserByDomain"
              className="translate-y-0.5"
            />
            <label htmlFor="shouldAttachUserByDomain" className="space-y-1">
              <span className="text-sm leading-none font-medium">
                Attach users by email domain
              </span>
              <p className="text-muted-foreground text-sm">
                Automatically add users with emails matching this domain
              </p>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save Organization
        </Button>
      </form>
    </div>
  )
}
