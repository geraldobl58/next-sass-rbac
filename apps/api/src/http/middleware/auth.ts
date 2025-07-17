import { FastifyInstance } from 'fastify'
import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

import { fastifyPlugin } from 'fastify-plugin'

import { prisma } from '../../lib/prisma'

import '@fastify/jwt'
import { Member, Organization } from '@prisma/client'

// Extend FastifyRequest to include getValidationUserId
declare module 'fastify' {
  interface FastifyRequest {
    getCurrentUseId: () => Promise<string>
    getUserMembership: (
      slug: string
    ) => Promise<{ organization: Organization; membership: Member }>
  }
}

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUseId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('User not authenticated')
      }
    }

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUseId()
      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        include: {
          organization: true,
        },
      })

      if (!member) {
        throw new UnauthorizedError(
          'User does not have access to this organization'
        )
      }

      const { organization, ...membership } = member

      return {
        organization,
        membership,
      }
    }
  })
})
