import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const user = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'janedoe@email.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/22802518?v=4',
      password: await hash('123456', 1),
    },
  })

  const otherUserOne = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      password: await hash('123456', 1),
    },
  })

  const otherUserTwo = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      password: await hash('123456', 1),
    },
  })

  await prisma.organization.create({
    data: {
      name: 'My Organization (Admin)',
      domain: 'my-organization.com',
      slug: 'my-organization',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUserByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'ADMIN' },
            { userId: otherUserOne.id, role: 'MEMBER' },
            { userId: otherUserTwo.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'My Organization (Member)',
      slug: 'my-organization-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'MEMBER' },
            { userId: otherUserOne.id, role: 'ADMIN' },
            { userId: otherUserTwo.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'My Organization (Billing)',
      slug: 'my-organization-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                otherUserOne.id,
                otherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'BILLING' },
            { userId: otherUserOne.id, role: 'ADMIN' },
            { userId: otherUserTwo.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Database seeded successfully!')
})
