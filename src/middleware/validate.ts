import { Request, Response, NextFunction } from 'express'
import { AnySchema, parse } from 'valibot'

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await parse(schema, req.body)
      next()
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

export default validate
