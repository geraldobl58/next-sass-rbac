import { FastifyInstance } from 'fastify'
import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

import { fastifyPlugin } from 'fastify-plugin'

import '@fastify/jwt'

// Extend FastifyRequest to include getValidationUserId
declare module 'fastify' {
  interface FastifyRequest {
    getCurrentUseId: () => Promise<string>
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
  })
})
