import { IService, IRepository } from '../interfaces'

// Service is where we put all our business logic.
// It can be considered a middle-ground where we don't have to worry about
// how we read/write things to the database or how we receive/respond http requests.
export abstract class AbstractService<T> implements IService<T> {
  constructor (
    protected readonly repository: IRepository<T>
  ) {}

  public async create (data: T): Promise<T> {
    return await this.repository.create(data)
  }

  public async read (): Promise<T[]> {
    return await this.repository.read()
  }

  public async update (id: string, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data)
  }

  public async delete (id: string): Promise<T | null> {
    return await this.repository.delete(id)
  }
}
