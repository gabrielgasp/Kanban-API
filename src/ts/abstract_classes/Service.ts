import { IRepository } from '../interfaces'

export abstract class AbstractService<T> {
  constructor (
    protected readonly repository: IRepository<T>
  ) {}

  public async create (data: T): Promise<T> {
    return await this.repository.create(data)
  }
}
