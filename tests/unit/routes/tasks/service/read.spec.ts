import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const tasksService = new TasksService(mockTasksRepository)

const fakeRepositoryResponse = {
  docs: [
    {
      _id: '1',
      boardId: 1,
      status: 'todo',
      title: 'some todo task',
      description: 'todo description',
      priority: 1,
      members: ['John', 'Jane'],
      tags: ['not so important']
    },
    {
      _id: '2',
      boardId: 2,
      status: 'in_progress',
      title: 'some task in progress',
      description: 'task in progress description',
      priority: 1,
      members: ['John', 'Jane'],
      tags: ['important']
    }
  ],
  totalDocs: 2,
  limit: 10,
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
}

describe("TasksService read method unit tests", () => {
  beforeAll(() => {
    mockTasksRepository.read = jest.fn()  // mock the return value of the tasksRepository.read method with whatever the test needs.
    .mockResolvedValueOnce(fakeRepositoryResponse)
    .mockResolvedValueOnce(fakeRepositoryResponse)
    .mockResolvedValueOnce({ ...fakeRepositoryResponse, page: 2, hasPrevPage: true, prevPage: 1 })
    .mockResolvedValueOnce(fakeRepositoryResponse)
    .mockResolvedValueOnce({ ...fakeRepositoryResponse, page: 1, hasNextPage: true, nextPage: 2 })
    .mockResolvedValueOnce(fakeRepositoryResponse)
  })

  it("should call the read method of the repository with page and limit arguments", async () => {
    await tasksService.read('1', '5')

    expect(mockTasksRepository.read).toHaveBeenCalledWith(1, 5)
  })

  it("should return the data and properties of the repository's read method response", async () => {
    const result = await tasksService.read('1', '5')

    expect(result.data).toEqual(fakeRepositoryResponse.docs)
    expect(result.totalDocs).toBe(fakeRepositoryResponse.totalDocs)
    expect(result.docsPerPage).toBe(fakeRepositoryResponse.limit)
    expect(result.currentPage).toBe(fakeRepositoryResponse.page)
    expect(result.totalPages).toBe(fakeRepositoryResponse.totalPages)
  })

  describe('When there is a previous page', () => {
    it('should return an object with previousPage property and value', async () => {
      const result = await tasksService.read('2', '5')

      expect(result.previousPage).toBe(1)
    })
  })

  describe('When there is no previousPage', () => {
    it('should return an object with property data and no property previousPage', async () => {
      const result = await tasksService.read('1', '5')

      expect(result.previousPage).toBeUndefined()
    })
  })

  describe('When there is a next page', () => {
    it('should return an object with property data and property nextPage', async () => {
      const result = await tasksService.read('1', '5')

      expect(result.nextPage).toBe(2)
    })
  })

  describe('When there is no nextPage', () => {
    it('should return an object with property data and no property nextPage', async () => {
      const result = await tasksService.read('2', '5')

      expect(result.nextPage).toBeUndefined()
    })
  })
})