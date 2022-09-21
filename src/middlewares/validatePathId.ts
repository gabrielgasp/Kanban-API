import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

export const validatePathId = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (!mongoose.isValidObjectId(req.params.id)) { // If this method is used anywhere else, an adapter must be created!
    return res.status(400)
      .json({ message: '"id" must be a valid ObjectId' })
  }
  return next()
}
