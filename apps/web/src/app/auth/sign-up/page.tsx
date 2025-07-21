import Link from 'next/link'

import { GithubIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignUpPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input name="name" type="text" id="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirm password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Button type="submit" className="w-full" size="sm" variant="link" asChild>
        <Link href="/auth/sign-in">Already have an account? Sign in</Link>
      </Button>

      <Separator />

      <Button type="submit" className="w-full" variant="outline">
        <GithubIcon className="mr-2 h-4 w-4" />
        Sign up with Github
      </Button>
    </form>
  )
}
