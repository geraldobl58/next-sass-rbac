import { FastifyInstance } from 'fastify'

import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'

import { auth } from '../../middleware/auth'

export async function getOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Get Organization by Slug',
          description:
            'Get an organization by its slug. The user must be authenticated.',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            slug: z.string().min(1, 'Organization slug is required'),
          }),
          response: {
            200: z.object({
              organization: z.object({
                name: z.string(),
                slug: z.string(),
                id: z.string(),
                domain: z.string().nullable(),
                shouldAttachUserByDomain: z.boolean(),
                avatarUrl: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
                ownerId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        return {
          organization,
        }
      }
    )
}
