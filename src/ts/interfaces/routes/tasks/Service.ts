import { IService } from '../../abstract_classes'
import { ITask } from '../../entities'

export interface ITasksService extends IService<ITask> {
  updateMembers: (id: string, operation: 1 | -1, value: string) => Promise<ITask | null>
}
