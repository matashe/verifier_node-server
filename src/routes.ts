import { Router } from 'express'
import defaultRouter from './routes/defaultRouter'

const router = Router()
router.use(defaultRouter)

export default router
