import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt.utils'
import logger from './../utils/logger'

const authorize = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.headers.cookie

  if (!cookie) {
    return res
      .status(401)
      .send({ data: { status: '401', message: 'Jwt cookie is missing' } })
  }

  const token = cookie.split('=')[1]

  if (!token) {
    return res.status(401).send('Unauthorized - No token provided')
  }

  try {
    verifyJwt(token)
    next()
  } catch (error: any) {
    return res
      .status(401)
      .send({ data: { status: 401, message: error.message } })
  }
}

export default authorize
