import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getOrCreateUser = async (email: string) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      return user
    }

    const newUser = await prisma.user.create({
      data: {
        email,
      },
    })

    return newUser
  } catch (error: any) {
    throw new Error('Failed to create user')
  }
}
