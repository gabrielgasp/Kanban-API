import { Request, Response } from 'express'
import { IController, IService } from '../interfaces'

// Controller is where we handle everything related to http requests.
// It is responsible to call the service and return the correct status code and data
// to the client according to the result of the operation.
// The controller has no knowledge of the database or business logic behind your application.
export abstract class Controller<T> implements IController {
  constructor (
    protected service: IService<T>
  ) {}

  public async create (req: Request, res: Response): Promise<Response> {
    const result = await this.service.create(req.body)
    return res.status(201).json(result)
  }

  public async read (req: Request, res: Response): Promise<Response> {
    const result = await this.service.read()
    return res.status(200).json(result)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const result = await this.service.update(req.params.id, req.body)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }
}
