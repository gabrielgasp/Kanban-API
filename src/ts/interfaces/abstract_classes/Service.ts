export interface serviceReadResponse<T> {
  previousPage?: number
  nextPage?: number
  data: T[]
}

export interface IService<T> {
  create: (data: T) => Promise<T>
  read: (page?: string, limit?: string) => Promise<serviceReadResponse<T>>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<T | null>
}
