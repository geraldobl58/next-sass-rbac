import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '@sass/env'

import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        summary: 'Authenticate with GitHub',
        description:
          'This endpoint allows users to authenticate using their email and password.',
        tags: ['Auth'],
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubAuthURL = new URL(
        'https://github.com/login/oauth/access_token'
      )

      githubAuthURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
      githubAuthURL.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET)
      githubAuthURL.searchParams.set('redirect_uri', env.GITHUB_REDIRECT_URI)
      githubAuthURL.searchParams.set('code', code)

      const githubAccessTokenResponse = await fetch(githubAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          name: z.string().nullable(),
          email: z.string().nullable(),
          avatar_url: z.string().url(),
        })
        .parse(githubUserData)

      if (email == null) {
        throw new BadRequestError('GitHub account does not have an email.')
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d', // Token expiration time
          },
        }
      )

      return reply.status(201).send({
        token,
        message: 'Authentication successful',
      })
    }
  )
}
