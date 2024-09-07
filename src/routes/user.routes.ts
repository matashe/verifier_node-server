import { Router } from 'express'
import validate from '../middleware/validate'
import authorize from '../middleware/authorize'

// Controllers
import {
  createUserHandler,
  getUserHandler,
} from '../controllers/user.controller'

// Schemas
import { createUserSchema } from '../schemas/user.schema'

const userRouter = Router()

userRouter.get('/api/users', (req, res) => {
  res.send('Hello Users!')
})

userRouter.get('/api/users/:id', authorize, (req, res) => {
  getUserHandler(req, res)
})

userRouter.post('/api/users', validate(createUserSchema), (req, res) => {
  createUserHandler(req, res)
})

export default userRouter
