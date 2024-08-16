import express from 'express'
import router from './routes'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
