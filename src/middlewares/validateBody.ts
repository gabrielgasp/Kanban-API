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

/*
  Every validation error message from the bodyValidator function contains the status code and the actual message separated by a "|".
  For example, if we have a validation error with the message "400|Invalid name", the code will be 400 and the message will be
  "Invalid name". In the validateBody function we use the split method to split the message into code and message and use them to
  send a response to the client.

  If, for some reason, we receive an unhandled validation error (where the message does not contain a "|"), and we try to split it,
  the split method will return an array with the error message as the first element and undefined as the second. Knowing this,
  we can check if the message is empty and if it is, we know that it's and unhandled error so we send it to the errorHandler middleware.
*/
