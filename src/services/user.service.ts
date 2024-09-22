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

export const createUserByOauthService = async (
  email: string,
  name: string,
  surname: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      surname,
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

export const getUserByEmailService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
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

export const updateUserNameAndSurnameService = async (
  email: string,
  name: string,
  surname: string
) => {
  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
        surname,
      },
    })

    return user
  } catch (error: any) {
    throw new Error('Failed to update user')
  }
}
