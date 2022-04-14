import { Request, Response } from 'express'
import { IController, IService } from '../interfaces'

export abstract class Controller<T> implements IController {
  constructor (
    protected service: IService<T>
  ) {}

  public async create (req: Request, res: Response): Promise<Response> {
    const result = await this.service.create(req.body)
    return res.status(201).json(result)
  }
}
