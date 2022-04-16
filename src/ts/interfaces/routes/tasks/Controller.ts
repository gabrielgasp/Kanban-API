import { Request, Response } from 'express'
import { IController } from '../../abstract_classes'

export interface ITasksController extends IController {
  readFromBoard: (req: Request, res: Response) => Promise<Response>
  updateMembers: (req: Request, res: Response) => Promise<Response>
  updateTags: (req: Request, res: Response) => Promise<Response>
}
