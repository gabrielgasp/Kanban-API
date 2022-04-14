import { IService, IRepository } from '../interfaces'

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
}
