import { Model, Document } from 'mongoose'
import { IRepository } from '../interfaces'

export abstract class Repository<T> implements IRepository<T> {
  constructor (
    protected readonly model: Model<T & Document>
  ) {}

  public async create (data: T): Promise<T> {
    return await this.model.create(data)
  }

  public async read (): Promise<T[]> {
    return await this.model.find()
  }

  public async update (id: string, data: T): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  public async delete (id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id)
  }
}
