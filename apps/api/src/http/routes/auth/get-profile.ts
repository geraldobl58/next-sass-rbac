import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import z from 'zod'

import { prisma } from '../../../lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        summary: 'Get authenticate user profile',
        description: 'Retrieve the profile of the authenticated user.',
        tags: ['Auth'],
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().email().nullable(),
              avatarUrl: z.string().nullable(),
            }),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        where: {
          id: sub,
        },
      })

      if (!user) {
        return reply.status(401).send({
          message: 'Unauthorized',
        })
      }

      return reply.send({ user })
    }
  )
}
