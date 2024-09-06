import { Request, Response, NextFunction } from 'express'
import { ObjectSchema, parse } from 'valibot'

const validate =
  (schema: ObjectSchema<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await parse(schema, req.body)
      next()
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

export default validate
