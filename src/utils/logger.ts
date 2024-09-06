import pino from 'pino'
import PinoPretty from 'pino-pretty'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // Enable colorization
      levelFirst: true, // Display level as the first field
      translateTime: 'yyyy-mm-dd HH:MM:ss', // Custom timestamp format
    },
  },
})

export default logger
