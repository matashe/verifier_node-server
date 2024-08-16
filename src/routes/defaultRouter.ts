import { Router } from 'express'

const defaultRouter = Router()

defaultRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

export default defaultRouter
