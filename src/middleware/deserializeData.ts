import { Request, Response, NextFunction } from 'express'
import logger from './../utils/logger'
import { verifyJwt } from './../utils/jwt.utils'
import lodash from 'lodash'
import { User } from '@prisma/client'

const deserializeData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.headers.cookie

  if (!cookie) {
    res.status(400).send({ data: { message: 'Invalid token' } })
    return
  }

  const token = cookie.split('=')[1]

  try {
    const payload = await verifyJwt(token)

    const user = lodash.get(payload, 'user')
    const sessionId = lodash.get(payload, 'sessionId')

    if (!user || !sessionId) {
      throw new Error('Invalid token')
    }

    lodash.set(req, 'user', user)
    lodash.set(req, 'sessionId', sessionId)

    next()
  } catch (error: any) {
    logger.error(error)
    res.status(400).send({ data: { message: error.message } })
  }
}

export default deserializeData
