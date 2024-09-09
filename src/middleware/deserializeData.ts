import { Request, Response, NextFunction } from 'express'
import logger from './../utils/logger'
import { verifyJwt } from './../utils/jwt.utils'
import { set } from 'lodash'
import { User } from '@prisma/client'

interface RequestWithPayload extends Request {
  data: {
    user: Omit<User, 'password'>
    sessionId: string
  }
}

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

    res.send({ data: payload })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send({ data: { message: error.message } })
  }
}

export default deserializeData
