import { FastifyInstance } from 'fastify'

import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'

import { rolesSchema } from '@sass/auth'

import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Get Organizations where the user is a member',
          description:
            'Get a list of organizations. The user must be authenticated.',
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  role: rolesSchema,
                })
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUseId()

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const organizationsWithUserRole = organizations.map(
          ({ members, ...org }) => {
            return {
              ...org,
              role: members[0]?.role,
            }
          }
        )

        return {
          organizations: organizationsWithUserRole,
        }
      }
    )
}
