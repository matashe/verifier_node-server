import { sign, verify, SignOptions, decode } from 'jsonwebtoken'
import logger from './logger'

export const signJwt = (payload: any, options: SignOptions) => {
  const token = sign(
    payload,
    process.env.ENCRYPTION_R256_PRIVATE_KEY as string,
    {
      algorithm: 'RS256',
      ...options,
    }
  )

  return token
}

export const verifyJwt = (token: string) => {
  try {
    const payload = verify(
      token,
      process.env.ENCRYPTION_R256_PUBLIC_KEY as string
    )
    return payload
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const decodeJwt = (token: string) => {
  try {
    const payload = decode(token, { json: true })
    return payload
  } catch (error: any) {
    logger.error(error)
    return null
  }
}
