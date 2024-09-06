import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export const createUserService = (email: string, password: string) => {
  const salt_rounds = process.env.ENCRYPTION_BCRYPT_SALT_ROUNDS

  const hashedPassword = bcrypt.hashSync(password, Number(salt_rounds))

  logger.info(hashedPassword)
}
