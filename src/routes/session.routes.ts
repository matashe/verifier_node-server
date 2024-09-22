import { Router } from 'express'
import validate from '../middleware/validate'
import deserializeData from '../middleware/deserializeData'
import logger from '../utils/logger'

// Controllers
import {
  createSessionHandler,
  createSessionAzureHandler,
  refreshSessionHandler,
  deleteSessionHandler,
} from '../controllers/session.controller'

// Schemas
import { createSessionSchema } from '../schemas/session.schema'
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

sessionRouter.get('/api/sessions/oauth/azure', (req, res) => {
  createSessionAzureHandler(req, res)
})

sessionRouter.put('/api/sessions', (req, res) => {
  refreshSessionHandler(req, res)
})

sessionRouter.delete(
  '/api/sessions',
  authorize,
  deserializeData,
  (req, res) => {
    deleteSessionHandler(req, res)
  }
)

export default sessionRouter
