import { env } from '@sass/env'
import { getCookie } from 'cookies-next'
import ky from 'ky'

const TOKEN_COOKIE_NAME = 'token'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined

        if (typeof window === 'undefined') {
          // Server-side
          const { cookies: serverCookies } = await import('next/headers')
          const cookieStore = await serverCookies()
          token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
        } else {
          // Client-side
          token = getCookie(TOKEN_COOKIE_NAME) as string | undefined
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
