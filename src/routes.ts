import { Router } from 'express'
import defaultRouter from './routes/default.routes'
import userRouter from './routes/user.routes'

const router = Router()
router.use(defaultRouter)
router.use(userRouter)

export default router
