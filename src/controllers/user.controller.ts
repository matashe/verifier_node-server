import { Request, Response } from 'express'
import {
  createUserService,
  getUserByIdService,
  getUsersService,
} from '../services/user.service'

export const createUserHandler = async (req: Request, res: Response) => {
  const data = req.body.data

  if (data.password !== data.passwordConfirmation) {
    res.status(400).send({ data: { message: 'Passwords do not match.' } })
    return
  }

  try {
    const user = await createUserService(data.email, data.password)
    res.status(201).send({ data: user })
  } catch (error: any) {
    res.status(400).send({ data: { message: error.message } })
  }
}

export const getUserHandler = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const user = await getUserByIdService(id)
    res.status(200).send({ data: user })
  } catch (error: any) {
    res.status(404).send({ data: { message: error.message } })
  }
}

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService()
    res.status(200).send({ data: users })
  } catch (error: any) {
    res.status(404).send({ data: { message: error.message } })
  }
}
