import { Router } from 'express'
import { Controller } from '../../ts/abstract_classes'
import { ITask, IMiddlewares, IValidators } from '../../ts/interfaces'

export class TasksRouter {
  public router = Router()

  constructor (
    private readonly controller: Controller<ITask>,
    private readonly middlewares: IMiddlewares,
    private readonly validators: IValidators
  ) {
    this.init()
  }

  /*
  About validateBody:
  validateBody is a function that expects another function as argument (one that follows the TBodyValidator contract).
  When we call validateBody with said function as argument, it will return a new function that will be used as middleware.
  The new function will be called by express with the request, response and next, and will validate the body of the request
  using the function we passed in the first place. This way we can have a generic "validateBody" middleware that can be used
  for any request that has a body.
  */

  public init (): void {
    this.router.post(
      '/',
      this.middlewares.validateBody(this.validators.newTaskValidator),
      this.controller.create
    )

    this.router.get('/', this.controller.read)
  }
}
