import { Request, Response } from 'express'
import { createUserService } from '../services/user.service'

export const createUserHandler = async (req: Request, res: Response) => {
  const data = req.body.data

  if (data.password !== data.passwordConfirmation) {
    res.status(400).send({ data: { message: 'Passwords do not match.' } })
    return
  }

  res.send('Baad')
}
