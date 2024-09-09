import { Router } from 'express'
import validate from '../middleware/validate'
import deserializeData from '../middleware/deserializeData'
import { RequestWithPayload } from '../types/request.type'
import logger from '../utils/logger'

// Controllers
import {
  createSessionHandler,
  refreshSessionHandler,
  deleteSessionHandler,
} from '../controllers/session.controller'

// Schemas
import {
  createSessionSchema,
  refreshSessionSchema,
} from '../schemas/session.schema'
import authorize from '../middleware/authorize'

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

sessionRouter.delete(
  '/api/sessions',
  authorize,
  deserializeData,
  (req, res) => {
    deleteSessionHandler(req, res)
  }
)

export default sessionRouter
