import { Router } from 'express'
import defaultRouter from './routes/default.routes'
import userRouter from './routes/user.routes'
import sessionRouter from './routes/session.routes'

const router = Router()
router.use(defaultRouter)
router.use(userRouter)
router.use(sessionRouter)

export default router
