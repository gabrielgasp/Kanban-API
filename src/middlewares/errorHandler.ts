import { NextFunction, Request, Response } from 'express'

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
  console.error(error)
  return res.status(500).json({ message: 'Something went wrong here, please try again later' })
}
