import { FastifyInstance } from 'fastify'

import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'

import { organizationSchema } from '@sass/auth'

import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '../../../utils/get-user-permissions'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Update Organization',
          description:
            'Update an organization. The user must be authenticated and be an admin of the organization.',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string().min(1, 'Organization name is required'),
            domain: z.string().nullish(),
            shouldAttachUserByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUseId()

        const { membership, organization } =
          await request.getUserMembership(slug)

        const { name, domain, shouldAttachUserByDomain } = request.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'You are not authorized to update this organization'
          )
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              id: {
                not: organization.id,
              },
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization already exists with this domain'
            )
          }
        }

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUserByDomain: shouldAttachUserByDomain || false,
          },
        })

        return reply.status(204).send()
      }
    )
}
