import { PaginateResult } from 'mongoose'

export interface IRepository<T> {
  countDocuments: () => Promise<number>
  create: (data: T) => Promise<T>
  read: (skip: number, limit: number) => Promise<PaginateResult<T>>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<T | null>
}
