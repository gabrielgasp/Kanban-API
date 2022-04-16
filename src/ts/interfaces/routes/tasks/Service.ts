import { IService } from '../../abstract_classes'
import { ITask } from '../../entities'

export interface ITasksService extends IService<ITask> {
  readFromBoard: (boardId: string) => Promise<ITask[]>
  updateMembers: (id: string, operation: 1 | -1, value: string) => Promise<ITask | null>
  updateTags: (id: string, operation: 1 | -1, value: string) => Promise<ITask | null>
}
