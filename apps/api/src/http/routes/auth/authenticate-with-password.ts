import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { compare } from 'bcryptjs'

import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        summary: 'Authenticate user with email and password',
        description:
          'This endpoint allows users to authenticate using their email and password.',
        tags: ['Auth'],
        body: z.object({
          email: z.string().email('Invalid email address'),
          password: z.string().min(6, 'Password must be at least 6 characters'),
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
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        throw new BadRequestError('Invalid credentials')
      }

      if (userFromEmail.password === null) {
        throw new BadRequestError('User has no password set')
      }

      const isPasswordValid = await compare(password, userFromEmail.password)

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
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
