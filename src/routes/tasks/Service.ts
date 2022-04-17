import { AbstractService } from '../../ts/abstract_classes'
import { ITask, ITasksRepository, ITasksService } from '../../ts/interfaces'

// This is the class that will be used to handle business logic for the tasks;
// It has the same methods as the abstract Service class, but it uses a "TaskRepository" instance provided as argument
// to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksService extends AbstractService<ITask> implements ITasksService {
  // We need to specify a constructor for the TasksService class that will receive a repository that follows ITasksRepository interface.
  // This is because we need to use the methods that do not exist in the abstract (generic) repository.
  // If we don't specify a constructor, the "updateMembers" method will be undefined.
  constructor (protected readonly repository: ITasksRepository) {
    super(repository)
  }

  // Here we create a new method exclusive to the TasksService class that will be used to read tasks from a specific board.
  public async readFromBoard (boardId: string): Promise<ITask[]> {
    return await this.repository.readFromBoard(boardId)
  }

  // Here we create a new method exclusive to the TasksService class that will be used to update the members array.
  public async updateMembers (id: string, operation: 1 | -1, value: string): Promise<ITask | null> {
    const op = operation === 1 ? '$addToSet' : '$pull'
    return await this.repository.updateMembers(id, op, value)
  }

  // This is basically a copy of the updateMembers implementation.
  public async updateTags (id: string, operation: 1 | -1, value: string): Promise<ITask | null> {
    return await this.repository.updateTags(id, operation, value)
  }
}
