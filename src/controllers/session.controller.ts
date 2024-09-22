import { Request, Response } from 'express'
import { getAuthToken, getScope } from './../utils/azure.utils'
import lodash from 'lodash'
import logger from './../utils/logger'

// Services
import {
  createSessionService,
  createSessionAzureService,
  refreshSessionService,
  invalidateSessionService,
} from './../services/session.service'

import { updateUserNameAndSurnameService } from './../services/user.service'

export const createSessionHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body.data

  try {
    const session = await createSessionService(email, password)

    res.cookie('jwt', session.token, {
      httpOnly: true, // Cookie is not accessible from JavaScript
      sameSite: 'none', // Restricts the cookie to be sent with cross-origin requests
    })
    res.status(201)
    res.send({ data: { message: 'Session created' } })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send({ data: { message: error.message } })
  }
}

export const createSessionAzureHandler = async (
  req: Request,
  res: Response
) => {
  const { code } = req.query

  try {
    // Get Azure token
    const { access_token, refresh_token } = await getAuthToken(code as string)

    if (!access_token) {
      throw new Error('Failed to get Azure token')
    }

    // Get scope from entra ID
    const { userPrincipalName, givenName, surname } = await getScope(
      access_token
    )

    const session = await createSessionAzureService(
      userPrincipalName,
      refresh_token
    )

    // Update user by email
    await updateUserNameAndSurnameService(userPrincipalName, givenName, surname)

    // Set token in cookie
    res.cookie('jwt', session.token, {
      httpOnly: true, // Cookie is not accessible from JavaScript
      sameSite: 'none', // Restricts the cookie to be sent with cross-origin requests
    })

    // Send response
    res.status(201)
    res.send({ data: { message: 'Session created' } })
  } catch (error: any) {
    res.status(400).send({ data: { message: error.message } })
  }
}

export const refreshSessionHandler = async (req: Request, res: Response) => {
  try {
    // Get jwt from cookie
    const token = req.headers.cookie?.split('=')[1]

    // Check if token is valid
    if (!token) {
      throw new Error('Invalid token')
    }

    // Refresh session
    const newToken = await refreshSessionService(token)

    // Set new token in cookie
    res.cookie('jwt', newToken, {
      httpOnly: true, // Cookie is not accessible from JavaScript
      sameSite: 'none', // Restricts the cookie to be sent with cross-origin requests
    })

    // Send response
    res.status(200)
    res.send({ data: { message: 'Session refreshed' } })
  } catch (error: any) {
    res.status(401).send({ data: { message: error.message } })
  }
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = lodash.get(req, 'sessionId')

  try {
    if (sessionId) {
      await invalidateSessionService(sessionId)
    }

    res.clearCookie('jwt')
    res.status(200)
    res.send({ data: { message: 'Session invalidated' } })
  } catch (error: any) {
    res.status(400).send({ data: { message: error.message } })
  }
}
