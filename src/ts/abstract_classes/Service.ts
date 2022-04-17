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
    let pageNumber = parseInt(page) > 0 ? parseInt(page) : 1

    // Here we are defining the requested limit as number after doing some checks to make sure we always have a valid limit value.
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10

    // Here we are counting the number of documents in the collection. We will use this information for a last check before our query.
    const documentCountInCollection = await this.repository.countDocuments()

    // Here we are checking if the requested page is greater than the total number of pages for the provided limit based on our collection document count.
    if (pageNumber * limitNumber > documentCountInCollection) {
      // If the requested page is indeed greater, we simply set the page to the last possible page.
      pageNumber = Math.ceil(documentCountInCollection / limitNumber)
    }

    // Here we are fetching the paginated data from the database.
    const paginatedData = await this.repository.read(pageNumber, limitNumber)

    return {
      totalDocs: paginatedData.totalDocs,
      docsPerPage: paginatedData.limit,
      totalPages: paginatedData.totalPages,
      currentPage: paginatedData.page,
      previousPage: paginatedData.hasPrevPage ? paginatedData.prevPage as number : undefined,
      nextPage: paginatedData.hasNextPage ? paginatedData.nextPage as number : undefined,
      docs: paginatedData.docs
    }
  }

  public async update (id: string, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data)
  }

  public async delete (id: string): Promise<T | null> {
    return await this.repository.delete(id)
  }
}
