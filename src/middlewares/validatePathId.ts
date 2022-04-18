import { Request, Response, NextFunction } from 'express'
import { isValidObjectId } from 'mongoose' // If this method is used anywhere else, an adapter must be created!

export const validatePathId = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (!isValidObjectId(req.params.id)) { // Verify if the id is a valid MongoDB ObjectId
    return res.status(400)
      .json({ message: '"id" must be a valid ObjectId' })
  }
  return next()
}
