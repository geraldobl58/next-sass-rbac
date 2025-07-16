import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import z from 'zod'

import { prisma } from '../../../lib/prisma'
import { auth } from '../../middleware/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile',
      {
        schema: {
          summary: 'Get authenticate user profile',
          description: 'Retrieve the profile of the authenticated user.',
          tags: ['Auth'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            200: z.object({
              user: z.object({
                id: z.string(),
                name: z.string().nullable(),
                email: z.string().email().nullable(),
                avatarUrl: z.string().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUseId()

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found')
        }

        return reply.send({ user })
      }
    )
}
