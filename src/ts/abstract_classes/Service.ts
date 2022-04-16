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

  public async read (page: string = '1', limit: string = '5'): Promise<serviceReadResponse<T>> {
    // We will use limit's default value in production. I left it as a parameter to comply with SOLID's OCP principle.
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1 // Here we are defining the pageNumber after doing some checks.
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 5 // Here we are defining the limitNumber after doing some checks.

    const skip = (pageNumber - 1) * limitNumber // Here we are calculating the skip value.

    const count = await this.repository.countDocuments() // Here we are counting the number of documents in the database. This is used to calculate the number of pages.

    const previousPage: number | undefined = skip > 0 ? pageNumber - 1 : undefined // Here we are defining the previousPage value (if any).
    const nextPage: number | undefined = skip + limitNumber < count ? pageNumber + 1 : undefined // Here we are defining the nextPage value (if any).

    const data = await this.repository.read(skip, limitNumber) // Here we are reading the data from the database.

    return {
      previousPage,
      nextPage,
      data
    }
  }

  public async update (id: string, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data)
  }

  public async delete (id: string): Promise<T | null> {
    return await this.repository.delete(id)
  }
}
