export interface serviceReadResponse<T> {
  totalDocs: number
  docsPerPage: number
  totalPages: number
  currentPage?: number
  previousPage?: number
  nextPage?: number
  docs: T[]
}

export interface IService<T> {
  create: (data: T) => Promise<T>
  read: (page?: string, limit?: string) => Promise<serviceReadResponse<T>>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<T | null>
}
