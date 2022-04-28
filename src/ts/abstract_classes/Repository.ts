import { Redis } from 'ioredis'
import { PaginateModel, Document, PaginateResult } from 'mongoose'
import { IRepository } from '../interfaces'

// Repository is where we abstract our database interactions.
// This allow us to use the same code for different database systems.
// As long as we respect the contract (T interface), we can easily change
// the database (or ORM/ODM) we use.
export abstract class AbstractRepository<T> implements IRepository<T> {
  constructor (
    protected readonly model: PaginateModel<T & Document>, // Here we expect a mongoose model that follows the generic T interface to be injected.
    protected readonly redis: Redis // Here we expect the redis client to be injected.
  ) {}

  public async countDocuments (): Promise<number> {
    const redisKey = `${this.model.modelName}:count` // Here I create a redis key that will be used to cache the data.
    if (await this.redis.exists(redisKey)) { // Check if we have this information in redis (cache).
      return Number(await this.redis.get(redisKey)) // If we do, we return the cached data.
    } else { // If we don't have it, we get it from the database and store it in redis for the next request.
      const docCount = await this.model.countDocuments()
      void this.redis.set(redisKey, docCount) // I'm not setting the expiration time for the key. When we create, update or delete a task, we manually clear redis cache.
      return docCount
    }
  }

  public async create (data: T): Promise<T> {
    const [dbResponse, redisKeys] = await Promise.all([ // Here we are using the Promise.all method to run both database and redis operations in parallel.
      this.model.create(data),
      this.redis.keys(`${this.model.modelName}:*`) // Here I get all redis keys that match the model name.
    ])
    if (redisKeys.length) void this.redis.del(redisKeys) // Here I delete all the keys that match the model name (if any). This is necessary so that the next time we read the data, we get the updated data.
    return dbResponse
  }

  public async read (page: number, limit: number): Promise<PaginateResult<T>> {
    const redisKey = `${this.model.modelName}:${page}:${limit}`
    if (await this.redis.exists(redisKey)) { // Redis logic here is similar to the countDocuments method.
      return JSON.parse(await this.redis.get(redisKey) as string)
    } else {
      const dbResponse = await this.model.paginate({}, { page, limit }) // Here we are using the paginate method of paginate-v2 to paginate our data.
      void this.redis.set(redisKey, JSON.stringify(dbResponse))
      return dbResponse
    }
  }

  public async update (id: string, data: Partial<T>): Promise<T | null> {
    const [dbResponse, redisKeys] = await Promise.all([ // Logic here is the same as in create method.
      this.model.findByIdAndUpdate(id, data, { new: true }),
      this.redis.keys(`${this.model.modelName}:*`)
    ])
    if (dbResponse && redisKeys.length) void this.redis.del(redisKeys)
    return dbResponse
  }

  public async delete (id: string): Promise<T | null> {
    const [dbResponse, redisKeys] = await Promise.all([ // Logic here is the same as in create method.
      this.model.findByIdAndDelete(id),
      this.redis.keys(`${this.model.modelName}:*`)
    ])
    if (dbResponse && redisKeys.length) void this.redis.del(redisKeys)
    return dbResponse
  }
}
