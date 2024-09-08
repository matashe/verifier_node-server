import { Request, Response } from 'express'
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
  const cookie = req.headers.cookie

  if (!cookie) {
    res.status(400).send({ data: { message: 'Invalid token' } })
    return
  }

  const refreshToken = cookie.split('=')[1]

  try {
    refreshSessionService(refreshToken)
  } catch (error: any) {
    res.status(400).send({ data: { message: error.message } })
  }
}

export const deleteSessionHandler = async (req: Request, res: Response) => {}
