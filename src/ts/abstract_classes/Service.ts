import { IService, IRepository, serviceReadResponse } from '../interfaces'

// Service is where we put all our business logic.
// It can be considered a middle-ground where we don't have to worry about
// how we read/write things to the database or how we receive/respond http requests.
export abstract class AbstractService<T> implements IService<T> {
  constructor (
    protected readonly repository: IRepository<T> // Here we expect a repository that follows the generic T interface to be injected.
  ) {}

  public async create (data: T): Promise<T> {
    return await this.repository.create(data)
  }

  public async read (page: string = '1', limit: string = '10'): Promise<serviceReadResponse<T>> {
    // Here we are defining the requested page as number after doing some checks to make sure we always have a valid page value.
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1

    // Here we are defining the requested limit as number after doing some checks to make sure we always have a valid limit value.
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10

    // Here we are fetching the paginated data from the database.
    const paginationData = await this.repository.read(pageNumber, limitNumber)

    return {
      totalDocs: paginationData.totalDocs,
      docsPerPage: paginationData.limit,
      totalPages: paginationData.totalPages,
      currentPage: paginationData.page,
      previousPage: paginationData.hasPrevPage ? paginationData.prevPage as number : undefined,
      nextPage: paginationData.hasNextPage ? paginationData.nextPage as number : undefined,
      data: paginationData.docs
    }
  }

  public async update (id: string, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data)
  }

  public async delete (id: string): Promise<T | null> {
    return await this.repository.delete(id)
  }
}
