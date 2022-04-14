import { Request, Response } from 'express'

export interface IController {
  create: (req: Request, res: Response) => Promise<Response>
}
