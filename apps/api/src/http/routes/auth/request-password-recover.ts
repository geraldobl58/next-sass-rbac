import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import z from 'zod'

import { prisma } from '../../../lib/prisma'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        summary: 'Request password recovery',
        description: 'Retrieve the profile of the authenticated user.',
        tags: ['Auth'],
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        return reply.status(201).send()
      }

      const { id: code } = await prisma.token.create({
        data: {
          token: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        },
      })

      console.log('Password recover code:', code)

      return reply.status(201).send()
    }
  )
}
