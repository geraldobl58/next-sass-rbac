import { FastifyInstance } from 'fastify'

import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'

import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'
import { getUserPermissions } from '../../../utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { rolesSchema } from '@sass/auth'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get Members',
          description:
            'Get the members of an organization. The user must be authenticated.',
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
              members: z.array(
                z.object({
                  userId: z.string().uuid(),
                  id: z.string().uuid(),
                  role: rolesSchema,
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                  email: z.string(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUseId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            'You do not have permission to view members.'
          )
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: 'asc',
          },
        })

        const memberWithRoles = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...user,
              ...member,
              userId,
            }
          }
        )

        return reply.send({ members: memberWithRoles })
      }
    )
}
