import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { compare } from 'bcryptjs'

import { prisma } from '../../../lib/prisma'

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
          400: z.object({
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
        return reply.status(400).send({
          message: 'Invalid email or password',
        })
      }

      if (userFromEmail.password === null) {
        return reply.status(400).send({
          message: 'User does not have a password set',
        })
      }

      const isPasswordValid = await compare(password, userFromEmail.password)

      if (!isPasswordValid) {
        return reply.status(400).send({
          message: 'Invalid email or password',
        })
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
