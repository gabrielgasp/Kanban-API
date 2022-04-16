import { IRepository } from '../abstract_classes'
import { ITask } from '../entities'

export interface ITasksRepository extends IRepository<ITask> {
  readFromBoard: (boardId: number) => Promise<ITask[]>
  updateMembers: (id: string, operation: 1 | -1, value: string) => Promise<ITask | null>
  updateTags: (id: string, operation: 1 | -1, value: string) => Promise<ITask | null>
}
