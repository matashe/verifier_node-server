import { Request, Response } from 'express'
import { RequestWithPayload } from '../types/request.type'
import lodash from 'lodash'
import logger from './../utils/logger'

// Services
import {
  createSessionService,
  refreshSessionService,
  invalidateSessionService,
} from './../services/session.service'

export const createSessionHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body.data

  try {
    const session = await createSessionService(email, password)

    res.cookie('jwt', session.token)
    res.status(201)
    res.send({ data: session.refreshToken })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send({ data: { message: error.message } })
  }
}

export const refreshSessionHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body.data

  try {
    const newToken = await refreshSessionService(refreshToken)

    res.cookie('jwt', newToken)
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
