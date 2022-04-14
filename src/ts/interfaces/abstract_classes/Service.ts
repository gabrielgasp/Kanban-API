export interface IService<T> {
  create: (data: T) => Promise<T>
  read: () => Promise<T[]>
}
