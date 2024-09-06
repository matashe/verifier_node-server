import { Router } from 'express'
import validate from '../middleware/validate'

// Controllers
import { createUserHandler } from '../controllers/user.controller'

// Schemas
import { createUserSchema } from '../schemas/user.schema'

const userRouter = Router()

userRouter.get('/api/users', (req, res) => {
  res.send('Hello Users!')
})

userRouter.post('/api/users', validate(createUserSchema), (req, res) => {
  createUserHandler(req, res)
})

export default userRouter
