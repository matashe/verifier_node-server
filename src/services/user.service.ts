import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import lodash from 'lodash'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export const createUserService = async (email: string, password: string) => {
  const salt_rounds = process.env.ENCRYPTION_BCRYPT_SALT_ROUNDS

  const hashedPassword = bcrypt.hashSync(password, Number(salt_rounds))

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  return user
}

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  return user
}

export const getUsersService = async () => {
  const users = await prisma.user.findMany()

  const usersWithoutPasswords = users.map((user) => {
    return lodash.omit(user, ['password'])
  })

  return usersWithoutPasswords
}
