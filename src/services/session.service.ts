import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signJwt, verifyJwt } from '../utils/jwt.utils'
import { v4 } from 'uuid'
import lodash from 'lodash'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export const createSessionService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('Invalid login')
  }

  // Compare the password with the hashed password
  if (user.password !== null) {
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      throw new Error('Invalid login')
    }
  }

  // Omit password from the user object
  const sessionUser = lodash.omit(user, 'password')

  try {
    // Create session id
    const sessionId = v4()

    // Create a JWT token
    const token = await signJwt(
      { user: sessionUser, sessionId },
      { expiresIn: '15m' }
    )
    const refreshToken = await signJwt(
      { user: sessionUser, sessionId },
      { expiresIn: '1y' }
    )

    // Create session
    const session = await prisma.session.create({
      data: {
        id: sessionId,
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

    // Check if the session is valid
    const sessionId = lodash.get(decoded, 'sessionId')
    const user = lodash.get(decoded, 'user')

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session || !session.valid) {
      throw new Error('Invalid session')
    }

    // Create new token
    const token = signJwt({ user, sessionId }, { expiresIn: '15m' })

    // Update session
    await prisma.session.update({
      where: { id: sessionId },
      data: { token },
    })

    return token
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const invalidateSessionService = async (sessionId: string) => {
  try {
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: { valid: false },
    })

    return session
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const checkSessionValidService = async (sessionId: string) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session || !session.valid) {
      throw new Error('Invalid session')
    }

    return true
  } catch (error: any) {
    throw new Error(error.message)
  }
}
