import express from 'express'
import router from './routes'
import dotenv from 'dotenv'
import logger from './utils/logger'
import cors from 'cors'

dotenv.config()
const PORT = process.env.SERVER_PORT || 1337

const corsOptions = {
  origin: 'http://localhost:3000', // Your Next.js frontend domain/port
  credentials: true, // Allow cookies and other credentials to be sent
}

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
})
