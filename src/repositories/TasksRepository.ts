import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { ITask, ITasksRepository } from '../ts/interfaces'

// This is the class that will be used to interact with the "tasks" collection;
// It has the same methods as the abstract Repository class, but it uses the "taskModel" provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksRepository extends AbstractRepository<ITask> implements ITasksRepository {
  // Here I'm overriding the read method from the abstract class so that we can return paginated and sorted tasks.
  public async read (page: number, limit: number): Promise<PaginateResult<ITask>> {
    const redisKey = `${this.model.modelName}:${page}:${limit}` // Here I create a redis key that will be used to cache the data.
    if (await this.redis.exists(redisKey)) { // Check if we have this information in redis (cache).
      return JSON.parse(await this.redis.get(redisKey) as string) // If we have it, we return it.
    } else { // If we don't have it, we get it from the database and store it in redis for the next request.
      const dbResponse = await this.model.paginate({}, { page, limit, sort: { boardId: 1, status: 1, priority: -1 } })
      void this.redis.set(redisKey, JSON.stringify(dbResponse)) // I'm not setting the expiration time for the key. When we create, update or delete a task, we manually clear redis cache.
      return dbResponse
    }
  }

  // Here we create a new method exclusive to the TasksRepository class that will be used to read tasks from a specific board.
  public async readFromBoard (boardId: string): Promise<ITask[]> {
    const redisKey = `${this.model.modelName}:${boardId}`
    if (await this.redis.exists(redisKey)) { // Redis logic is the same as the one in the read method.
      return JSON.parse(await this.redis.get(redisKey) as string)
    } else {
      const dbResponse = await this.model.find({ boardId }).sort({ status: 1, priority: -1 })
      void this.redis.set(redisKey, JSON.stringify(dbResponse))
      return dbResponse
    }
  }

  // Here we create a new method exclusive to the TasksRepository class that will be used to update the members array.
  public async updateMembers (id: string, operation: '$addToSet' | '$pull', value: string): Promise<ITask | null> {
    const [dbResponse, redisKeys] = await Promise.all([ // Here we are using the Promise.all to run both database and redis operations in parallel.
      this.model.findByIdAndUpdate(id, { [operation]: { members: value } }, { new: true }),
      this.redis.keys(`${this.model.modelName}:*`) // Here I get all redis keys that match the model name.
    ])
    if (dbResponse && redisKeys.length) void this.redis.del(redisKeys) // Here I delete all the keys that match the model name (if any). This is necessary so that the next time we read the data, we get the updated data.
    return dbResponse
  }

  // This is basically a copy of the updateMembers implementation.
  public async updateTags (id: string, operation: '$addToSet' | '$pull', value: string): Promise<ITask | null> {
    const [dbResponse, redisKeys] = await Promise.all([
      this.model.findByIdAndUpdate(id, { [operation]: { tags: value } }, { new: true }),
      this.redis.keys(`${this.model.modelName}:*`)
    ])
    if (dbResponse && redisKeys.length) void this.redis.del(redisKeys)
    return dbResponse
  }
}
