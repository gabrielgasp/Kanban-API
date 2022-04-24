import { Request, Response } from 'express'
import { IController, IService } from '../interfaces'

// Controller is where we handle everything related to http requests.
// It is responsible to call the service and return the correct status code and data
// to the client according to the result of the operation.
// The controller has no knowledge of the database or business logic behind your application.
export abstract class AbstractController<T> implements IController {
  constructor (
    protected service: IService<T> // Here we expect a service that follows the generic T interface to be injected.
  ) {
    this.create = this.create.bind(this) // These bindings are necessary to make sure that the "this" keyword is properly
    this.read = this.read.bind(this) //     bound to the controller. Without these bindings, the "this" keyword would be bound
    this.update = this.update.bind(this) // to the express request and we would get an error when trying to call the service,
    this.delete = this.delete.bind(this) // which is not what we want.
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const result = await this.service.create(req.body)
    return res.status(201).json(result)
  }

  public async read (req: Request, res: Response): Promise<Response> {
    const { page, limit } = req.query
    const result = await this.service.read(page as string | undefined, limit as string | undefined)
    return res.status(200).json(result)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const result = await this.service.update(req.params.id, req.body)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const result = await this.service.delete(req.params.id)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }
}
