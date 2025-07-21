import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <Button type="submit" className="w-full">
        Send reset link
      </Button>

      <Button type="submit" className="w-full" size="sm" variant="link" asChild>
        <Link href="/auth/sign-in">Back to Sign In</Link>
      </Button>
    </form>
  )
}
