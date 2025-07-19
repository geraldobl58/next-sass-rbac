import { FastifyInstance } from 'fastify'

import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'

import { rolesSchema } from '@sass/auth'

import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'
import { getUserPermissions } from '../../../utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create Invite',
          description: 'Create a new invite. The user must be authenticated.',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            slug: z.string().min(1, 'Organization slug is required'),
          }),
          body: z.object({
            email: z.string().email(),
            role: rolesSchema,
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
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

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            'You do not have permission to create an invite in this organization.'
          )
        }

        const { email, role } = request.body

        const [_, domain] = email

        if (
          organization.shouldAttachUserByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `Users with "${domain}" domain will join organization automatically on login.`
          )
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            `An invite has already been sent to ${email}.`
          )
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            `A member with email ${email} already exists in this organization.`
          )
        }

        const invite = await prisma.invite.create({
          data: {
            organizationId: organization.id,
            email,
            role,
            authorId: userId,
          },
        })

        return reply.status(201).send({
          inviteId: invite.id,
        })
      }
    )
}
