import { Redis } from "ioredis"
import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const mockRedis = {} as jest.Mocked<Redis>
const tasksRepository = new TasksRepository(mockTasksModel, mockRedis)

const fakeTaskResponse = [
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
    boardId: 1,
    status: 'in_progress',
    title: 'some task in progress',
    description: 'task in progress description',
    priority: 1,
    members: ['John', 'Jane'],
    tags: ['important']
  }
]

describe("TasksRepository readFromBoard method unit tests", () => {
  beforeAll(() => { // mock the value of taskModel.modelName property
    mockTasksModel.modelName = 'Task'
  })

  describe("When data is cached in redis", () => {
    it("Should return the data from redis cache", async () => {
      mockRedis.exists = jest.fn().mockResolvedValueOnce(1)
      mockRedis.get = jest.fn().mockResolvedValueOnce(JSON.stringify(fakeTaskResponse))

      const result = await tasksRepository.readFromBoard('1')

      expect(mockRedis.exists).toHaveBeenCalledWith('Task:1')
      expect(mockRedis.get).toHaveBeenCalledWith('Task:1')
      expect(result).toEqual(fakeTaskResponse)
    })
  })

  describe("When data is not cached in redis", () => {
    it("should call the find method of the model with boardId and sort method with sorting arguments, cache the result in redis and return it", async () => {
      mockRedis.exists = jest.fn().mockResolvedValueOnce(0)
      mockTasksModel.find = jest.fn().mockReturnValue({ // Here I'm not mocking it 'once' because we call it twice to test the sort method arguments.
        sort: jest.fn().mockResolvedValue(fakeTaskResponse)
      })
      mockRedis.set = jest.fn()

      const result = await tasksRepository.readFromBoard('1')

      expect(mockRedis.exists).toHaveBeenCalledWith('Task:1')
      expect(mockTasksModel.find).toHaveBeenCalledWith({ boardId: '1' })
      expect(mockTasksModel.find().sort).toHaveBeenCalledWith({ status: 1, priority: -1 })
      expect(mockRedis.set).toHaveBeenCalledWith('Task:1', JSON.stringify(fakeTaskResponse))
      expect(result).toEqual(fakeTaskResponse)
    })
  })
})