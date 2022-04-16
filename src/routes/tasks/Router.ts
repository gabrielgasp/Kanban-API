import { Router } from 'express'
import { IMiddlewares, IValidators, ITasksController } from '../../ts/interfaces'

export class TasksRouter {
  public router = Router()

  constructor (
    private readonly controller: ITasksController,
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

    this.router.patch(
      '/:id',
      this.middlewares.validatePathId,
      this.middlewares.validateBody(this.validators.updateTaskValidator),
      this.controller.update
    )

    this.router.patch(
      '/:id/members',
      this.middlewares.validatePathId,
      this.middlewares.validateBody(this.validators.updateTaskMembersOrTagsValidator),
      this.controller.updateMembers
    )

    this.router.patch(
      '/:id/tags',
      this.middlewares.validatePathId,
      this.middlewares.validateBody(this.validators.updateTaskMembersOrTagsValidator),
      this.controller.updateTags
    )

    this.router.delete(
      '/:id',
      this.middlewares.validatePathId,
      this.controller.delete
    )
  }
}
