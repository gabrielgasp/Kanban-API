import { NextFunction, Request, Response } from 'express'
import { TBodyValidator } from '../ts/types'

export const validateBody = (bodyValidator: TBodyValidator) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = bodyValidator(req.body)

    if (error) {
      const [code, message] = error.message.split('|')
      if (!message) return next(error)
      return res.status(Number(code)).json({ message })
    }

    req.body = value

    return next()
  }
