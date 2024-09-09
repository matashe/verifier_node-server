import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt.utils'
import { checkSessionValidService } from '../services/session.service'
import lodash from 'lodash'
import logger from './../utils/logger'

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  // Get the cookie from the request headers
  const cookie = req.headers.cookie

  if (!cookie) {
    return res
      .status(401)
      .send({ data: { status: '401', message: 'Jwt cookie is missing' } })
  }

  // Get the token from the cookie
  const token = cookie.split('=')[1]

  if (!token) {
    return res.status(401).send('Unauthorized - No token provided')
  }

  // Verify the token and session
  try {
    // Verify the token
    const payload = verifyJwt(token)

    // Get the session id from the payload
    const sessionId = lodash.get(payload, 'sessionId')

    if (!sessionId) {
      return res
        .status(401)
        .send({ data: { status: 401, message: 'Invalid session' } })
    }

    // Check if the session is valid
    const valid = await checkSessionValidService(sessionId)

    if (!valid) {
      return res
        .status(401)
        .send({ data: { status: 401, message: 'Invalid session' } })
    }

    next()
  } catch (error: any) {
    return res
      .status(401)
      .send({ data: { status: 401, message: error.message } })
  }
}

export default authorize
