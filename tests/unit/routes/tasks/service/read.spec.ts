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
  beforeEach(() => { // Here we reset our mock stored data before each test to make sure our assertions are reliable.
    mockTasksRepository.read.mockReset()
    mockTasksRepository.countDocuments.mockReset()
  })

  it("should call the read method of the repository with page and limit arguments", async () => {
    mockTasksRepository.countDocuments.mockResolvedValueOnce(30)
    mockTasksRepository.read.mockResolvedValueOnce(fakeRepositoryResponse)

    await tasksService.read('1', '5')

    expect(mockTasksRepository.read).toHaveBeenCalledWith(1, 5)
  })

  it('Should call the countDocuments method of the repository with no arguments', async () => {
    mockTasksRepository.countDocuments.mockResolvedValueOnce(30)
    mockTasksRepository.read.mockResolvedValueOnce(fakeRepositoryResponse)

    await tasksService.read('1', '5')

    expect(mockTasksRepository.countDocuments).toHaveBeenCalledWith()
  })

  it("should return the data and properties of the repository's read method response", async () => {
    mockTasksRepository.countDocuments.mockResolvedValueOnce(30)
    mockTasksRepository.read.mockResolvedValueOnce(fakeRepositoryResponse)

    const result = await tasksService.read('1', '5')

    expect(result.docs).toEqual(fakeRepositoryResponse.docs)
    expect(result.totalDocs).toBe(fakeRepositoryResponse.totalDocs)
    expect(result.docsPerPage).toBe(fakeRepositoryResponse.limit)
    expect(result.currentPage).toBe(fakeRepositoryResponse.page)
    expect(result.totalPages).toBe(fakeRepositoryResponse.totalPages)
  })

  describe('When there is a previous page', () => {
    it('should return an object with previousPage property and value', async () => {
      mockTasksRepository.countDocuments.mockResolvedValueOnce(30)
      mockTasksRepository.read.mockResolvedValueOnce({ ...fakeRepositoryResponse, page: 2, hasPrevPage: true, prevPage: 1 })

      const result = await tasksService.read('2', '5')

      expect(result.previousPage).toBe(1)
    })
  })

  describe('When there is no previousPage', () => {
    mockTasksRepository.countDocuments.mockResolvedValueOnce(30)
    it('should return an object with property docs and no property previousPage', async () => {
      mockTasksRepository.read.mockResolvedValueOnce(fakeRepositoryResponse)

      const result = await tasksService.read('1', '5')

      expect(result.previousPage).toBeUndefined()
    })
  })

  describe('When there is a next page', () => {
    it('should return an object with property docs and property nextPage', async () => {
      mockTasksRepository.countDocuments.mockResolvedValueOnce(30)
      mockTasksRepository.read.mockResolvedValueOnce({ ...fakeRepositoryResponse, page: 1, hasNextPage: true, nextPage: 2 })

      const result = await tasksService.read('1', '5')

      expect(result.nextPage).toBe(2)
    })
  })

  describe('When there is no nextPage', () => {
    it('should return an object with property docs and no property nextPage', async () => {
      mockTasksRepository.countDocuments.mockResolvedValueOnce(9)
      mockTasksRepository.read.mockResolvedValueOnce(fakeRepositoryResponse)

      const result = await tasksService.read('2', '5')

      expect(result.nextPage).toBeUndefined()
    })
  })

  describe('When requested page is greater than totalPages', () => {
    it('should call repository read method with last page possible given the limit provided and collection document count', async () => {
      mockTasksRepository.countDocuments.mockResolvedValueOnce(9)
      mockTasksRepository.read.mockResolvedValueOnce(fakeRepositoryResponse)

      const result = await tasksService.read('3', '5')

      expect(mockTasksRepository.read).toHaveBeenCalledWith(2, 5)
    })
  })
})