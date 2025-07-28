'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { AlertTriangle, GithubIcon, Loader2 } from 'lucide-react'

import { useFormState } from '@/hooks/use-form-state'

import { signInWithEmailAndPassword } from './actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { signInWithGithub } from '../actions'

export function SignInForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword
  )

  const searchParams = useSearchParams()

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            defaultValue={searchParams.get('emaiil') ?? ''}
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-foreground text-sm font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with email'
          )}
        </Button>

        <Button
          asChild
          type="submit"
          className="w-full"
          size="sm"
          variant="link"
          disabled={isPending}
        >
          <Link href="/auth/sign-up">Don't have an account? Sign up</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGithub}>
        <Button type="submit" className="w-full" variant="outline">
          <GithubIcon className="mr-2 h-4 w-4" />
          Sign in with Github
        </Button>
      </form>
    </div>
  )
}
