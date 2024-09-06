import express from 'express'
import router from './routes'
import dotenv from 'dotenv'
import logger from './utils/logger'

dotenv.config()
const PORT = process.env.SERVER_PORT || 1337

console.log('PORT:', PORT)

const app = express()

app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
})
