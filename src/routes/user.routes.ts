import { Router } from 'express'
import validate from '../middleware/validate'
import authorize from '../middleware/authorize'

// Controllers
import {
  createUserHandler,
  getUserHandler,
  getUsersHandler,
} from '../controllers/user.controller'

// Schemas
import { createUserSchema } from '../schemas/user.schema'

const userRouter = Router()

userRouter.get('/api/users', authorize, (req, res) => {
  getUsersHandler(req, res)
})

userRouter.get('/api/users/:id', authorize, (req, res) => {
  getUserHandler(req, res)
})

userRouter.put('/api/users/update-password', (req, res) => {
  res.send('Update user')
})

userRouter.post('/api/users', validate(createUserSchema), (req, res) => {
  createUserHandler(req, res)
})

export default userRouter
