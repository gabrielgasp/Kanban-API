import { Request, Response, NextFunction } from 'express'
import { TBodyValidator } from '../types'

type TErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => Response

type TValidateBody = (bodyValidator: TBodyValidator) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Response | void

type TValidatePathId = (
  req: Request,
  res: Response,
  next: NextFunction
) => Response | void

export interface IMiddlewares {
  errorHandler: TErrorHandler
  validateBody: TValidateBody
  validatePathId: TValidatePathId
}
