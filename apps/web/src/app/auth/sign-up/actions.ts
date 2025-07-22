'use server'

import { cookies } from 'next/headers'

import { HTTPError } from 'ky'

import { z } from 'zod'

import { redirect } from 'next/navigation'
import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: 'Name is required.',
      })
      .refine((value) => value.split(' ').length > 1, {
        message: 'Please, provide your full name.',
      }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail address.' }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long.',
    }),
    password_confirmation: z.string().min(6, {
      message: 'Password confirmation must be at least 6 characters long.',
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data.entries()))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, password } = result.data

  try {
    await signUp({ name, email, password })
  } catch (error) {
    if (error instanceof HTTPError) {
      return {
        success: false,
        message: 'Unaxpected error occurred. Please, try again later.',
        errors: null,
      }
    }
  }

  redirect('/')
}
