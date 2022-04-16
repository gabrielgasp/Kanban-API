export interface IRepository<T> {
  countDocuments: () => Promise<number>
  create: (data: T) => Promise<T>
  read: () => Promise<T[]>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<T | null>
}
