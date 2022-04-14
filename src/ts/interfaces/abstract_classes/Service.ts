export interface IService<T> {
  create: (data: T) => Promise<T>
  read: () => Promise<T[]>
  update: (id: string, data: Partial<T>) => Promise<T | null>
}
