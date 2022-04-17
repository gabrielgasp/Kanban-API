import { PaginateModel, Document, PaginateResult } from 'mongoose'
import { IRepository } from '../interfaces'

// Repository is where we abstract our database interactions.
// This allow us to use the same code for different database systems.
// As long as we respect the contract (T interface), we can easily change
// the database (or ORM/ODM) we use.
export abstract class AbstractRepository<T> implements IRepository<T> {
  constructor (
    protected readonly model: PaginateModel<T & Document> // Here we expect a mongoose model that follows the generic T interface to be injected.
  ) {}

  public async create (data: T): Promise<T> {
    return await this.model.create(data)
  }

  public async read (page: number, limit: number): Promise<PaginateResult<T>> {
    return await this.model.paginate({}, { page, limit })
    // return await this.model.find().skip(skip).limit(limit) // Here we are doing pagination based on parameters received.
  }

  public async update (id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  public async delete (id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id)
  }
}
