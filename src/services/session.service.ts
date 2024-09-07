import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signJwt, verifyJwt } from '../utils/jwt.utils'

const prisma = new PrismaClient()

export const createSessionService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('Invalid login')
  }

  // Compare the password with the hashed password
  // from the database
  if (user.password !== null) {
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      throw new Error('Invalid login')
    }
  }

  try {
    // Create a JWT token
    const token = await signJwt({ userId: user.id }, { expiresIn: '15m' })
    const refreshToken = await signJwt({ userId: user.id }, { expiresIn: '1y' })

    // Create session
    const session = await prisma.session.create({
      data: {
        token,
        refreshToken,
        valid: true,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    return session
  } catch (error: any) {
    throw new Error('Invalid login')
  }
}

export const refreshSessionService = async (refreshToken: string) => {
  try {
    const decoded = verifyJwt(refreshToken)
  } catch (error: any) {
    throw new Error(error.message)
  }
}
