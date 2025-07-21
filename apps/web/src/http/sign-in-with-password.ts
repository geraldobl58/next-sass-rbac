import { api } from './api-client'

interface SignWithPasswordRequest {
  email: string
  password: string
}

interface SignWithPasswordResponse {
  token: string
  message: string
}

export async function signInWithPassword({
  email,
  password,
}: SignWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignWithPasswordResponse>()

  return result
}
