import { PrismaClient, SessionType } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signJwt, verifyJwt, decodeJwt } from '../utils/jwt.utils'
import { v4 } from 'uuid'
import lodash from 'lodash'
import logger from '../utils/logger'
import { getOrCreateUser } from '../utils/session.utils'

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
        type: SessionType.STANDARD,
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

export const createSessionAzureService = async (
  email: string,
  refreshToken: string
) => {
  try {
    const user = await getOrCreateUser(email)

    // Create session id
    const sessionId = v4()

    // Create a JWT token
    const token = await signJwt({ user, sessionId }, { expiresIn: '15m' })

    // Create session
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        token,
        refreshToken,
        valid: true,
        type: SessionType.AZURE,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    return session
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const refreshSessionService = async (token: string) => {
  try {
    // Decode token
    const payload = decodeJwt(token)

    // Get Session
    const sessionId = lodash.get(payload, 'sessionId')
    const user = lodash.get(payload, 'user')

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    // Check if session is valid
    if (!session || !session.valid) {
      throw new Error('Invalid session')
    }

    // Check if refresh token is valid
    verifyJwt(session.refreshToken)

    // Create new token
    const newToken = signJwt({ user, sessionId }, { expiresIn: '15m' })

    // Update session
    await prisma.session.update({
      where: { id: sessionId },
      data: { token: newToken },
    })

    return newToken
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
