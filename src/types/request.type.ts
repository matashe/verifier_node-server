import { Request } from 'express'
import { User } from '@prisma/client'

type UserWithoutPassword = Omit<User, 'password'>

export type RequestWithPayload = Request & {
  data?: {
    user: UserWithoutPassword
    sessionId: string
  }
}
