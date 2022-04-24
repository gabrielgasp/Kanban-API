import { Request, Response } from 'express'
import { AbstractController } from '../../ts/abstract_classes'
import { ITask, ITasksController } from '../../ts/interfaces'
import { ITasksService } from '../../ts/interfaces/routes/tasks/Service'

// This is the class that will be used to handle everything relate to http requests for the tasks;
// It has the same methods as the abstract Controller class, but it uses a "TasksService" instance
// provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksController extends AbstractController<ITask> implements ITasksController {
  // We need to specify a constructor for the TasksController class that will receive a service that follows ITasksService interface.
  // This is because we need to use the methods that do not exist in the abstract (generic) service.
  // If we don't specify a constructor, the "updateMembers" method will be undefined.
  constructor (protected readonly service: ITasksService) {
    super(service)
    this.readFromBoard = this.readFromBoard.bind(this) // We also need to bind the method here so that we dont lose the context of the "this" keyword.
    this.updateMembers = this.updateMembers.bind(this)
    this.updateTags = this.updateTags.bind(this)
  }

  // Here we create a new method exclusive to the TasksController class that will be used to read tasks from a specific board.
  public async readFromBoard (req: Request, res: Response): Promise<Response> {
    const result = await this.service.readFromBoard(req.params.boardId)
    if (!result.length) {
      return res.status(404)
        .json({ message: 'No tasks were found for the boardId provided, please make sure that the board exist and have tasks' })
    }
    return res.status(200).json(result)
  }

  // Here we create a new method exclusive to the TasksController class that will be used to update the members array.
  public async updateMembers (req: Request, res: Response): Promise<Response> {
    const { operation, value } = req.body
    const result = await this.service.updateMembers(req.params.id, operation, value)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }

  // This is basically a copy of the updateMembers implementation.
  public async updateTags (req: Request, res: Response): Promise<Response> {
    const { operation, value } = req.body
    const result = await this.service.updateTags(req.params.id, operation, value)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }
}
