import { IRepository } from '../abstract_classes'
import { ITask } from '../entities'

export interface ITasksRepository extends IRepository<ITask> {
  readFromBoard: (boardId: string) => Promise<ITask[]>
  updateMembers: (id: string, operation: '$addToSet' | '$pull', value: string) => Promise<ITask | null>
}
