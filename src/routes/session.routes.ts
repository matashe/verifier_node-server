import { Router } from 'express'
import validate from '../middleware/validate'

// Controllers
import {
  createSessionHandler,
  refreshSessionHandler,
} from '../controllers/session.controller'

// Schemas
import {
  createSessionSchema,
  refreshSessionSchema,
} from '../schemas/session.schema'

const sessionRouter = Router()

sessionRouter.get('/api/sessions', (req, res) => {
  res.send('Hello Sessions!')
})

sessionRouter.post(
  '/api/sessions',
  validate(createSessionSchema),
  (req, res) => {
    createSessionHandler(req, res)
  }
)

sessionRouter.put(
  '/api/sessions',
  validate(refreshSessionSchema),
  (req, res) => {
    refreshSessionHandler(req, res)
  }
)

export default sessionRouter
