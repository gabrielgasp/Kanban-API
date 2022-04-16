import { AbstractRepository } from '../ts/abstract_classes'
import { ITask, ITasksRepository } from '../ts/interfaces'

// This is the class that will be used to interact with the "tasks" collection;
// It has the same methods as the abstract Repository class, but it uses the "taskModel" provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksRepository extends AbstractRepository<ITask> implements ITasksRepository {
  public async read (): Promise<ITask[]> { // Here I'm overriding the read method from the abstract class so that we can return sorted tasks.
    return await this.model.find().sort({ boardId: 1, status: 1, priority: -1 })
  }

  // Here we create a new method exclusive to the TasksRepository class that will be used to read tasks from a specific board.
  public async readFromBoard (boardId: number): Promise<ITask[]> {
    return await this.model.find({ boardId }).sort({ status: 1, priority: -1 })
  }

  // Here we create a new method exclusive to the TasksRepository class that will be used to update the members array.
  public async updateMembers (id: string, operation: 1 | -1, value: string): Promise<ITask | null> {
    const op = operation === 1 ? '$addToSet' : '$pull'
    return await this.model.findByIdAndUpdate(id, { [op]: { members: value } }, { new: true })
  }

  // This is basically a copy of the updateMembers implementation.
  public async updateTags (id: string, operation: 1 | -1, value: string): Promise<ITask | null> {
    const op = operation === 1 ? '$addToSet' : '$pull'
    return await this.model.findByIdAndUpdate(id, { [op]: { tags: value } }, { new: true })
  }
}
