'use server'

import { cookies } from 'next/headers'

import { HTTPError } from 'ky'

import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { redirect } from 'next/navigation'
import { acceptedInvite } from '@/http/accepted-invite'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z
    .string()
    .min(1, {
      message: 'Password must be at least 1 character long.',
    })
    .max(6, {
      message: 'Password must be at most 6 characters long.',
    }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data.entries()))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const cookieStore = await cookies()
    // Set the token in cookies
    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 2, // 2 days
    })

    const invited = cookieStore.get('inviteId')?.value

    if (invited) {
      try {
        await acceptedInvite(invited)
        cookieStore.delete('inviteId')
      } catch {}
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }
  }

  redirect('/')
}
