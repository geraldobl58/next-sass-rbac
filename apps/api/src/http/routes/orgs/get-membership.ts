import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '../../middleware/auth'

import { rolesSchema } from '@sass/auth'

import z from 'zod'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Get Membership',
          description:
            'Retrieve the membership status of a user in an organization. The user must be authenticated.',
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
              membership: z.object({
                id: z.string(),
                role: rolesSchema,
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        return {
          membership: {
            id: membership.id,
            role: rolesSchema.parse(membership.role),
            organizationId: membership.organizationId,
          },
        }
      }
    )
}
