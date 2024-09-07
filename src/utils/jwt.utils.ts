import { sign, verify, SignOptions } from 'jsonwebtoken'
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
    verify(token, process.env.ENCRYPTION_R256_PUBLIC_KEY as string)
  } catch (error: any) {
    throw new Error(error.message)
  }
}
