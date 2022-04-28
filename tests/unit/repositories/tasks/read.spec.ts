import { Redis } from "ioredis"
import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const mockRedis = {} as jest.Mocked<Redis>
const tasksRepository = new TasksRepository(mockTasksModel, mockRedis)

const fakePaginationResponse = {
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

describe("TasksRepository read method unit tests", () => {
  beforeAll(() => { // mock the value of taskModel.modelName property
    mockTasksModel.modelName = 'Task'
  })

  describe("When data is cached in redis", () => {
    it("Should return the data from redis cache", async () => {
      mockRedis.exists = jest.fn().mockResolvedValueOnce(1)
      mockRedis.get = jest.fn().mockResolvedValueOnce(JSON.stringify(fakePaginationResponse))

      const result = await tasksRepository.read(1, 5)

      expect(mockRedis.exists).toHaveBeenCalledWith('Task:1:5')
      expect(mockRedis.get).toHaveBeenCalledWith('Task:1:5')
      expect(result).toEqual(fakePaginationResponse)
    })
  })

  describe("When data is not cached in redis", () => {
    it("should call the model paginate method with the expected arguments, cache the result in redis and return it", async () => {
      mockRedis.exists = jest.fn().mockResolvedValueOnce(0)
      mockTasksModel.paginate = jest.fn().mockResolvedValueOnce(fakePaginationResponse)
      mockRedis.set = jest.fn()

      const result = await tasksRepository.read(1, 5)
  
      expect(mockRedis.exists).toHaveBeenCalledWith('Task:1:5')
      expect(mockTasksModel.paginate).toHaveBeenCalledWith({}, { page: 1, limit: 5, sort: { boardId: 1, status: 1, priority: -1 } })
      expect(mockRedis.set).toHaveBeenCalledWith('Task:1:5', JSON.stringify(fakePaginationResponse))
      expect(result).toEqual(fakePaginationResponse)
    })
  })
})