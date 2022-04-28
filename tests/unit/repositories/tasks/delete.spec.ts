import { Redis } from "ioredis"
import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const mockRedis = {} as jest.Mocked<Redis>
const tasksRepository = new TasksRepository(mockTasksModel, mockRedis)

const fakeDeletedTask = {
  _id: '1',
  boardId: 1,
  status: 'todo',
  title: 'some todo task',
  description: 'todo description',
  priority: 1,
  members: ['John', 'Jane'],
  tags: ['not so important']
}

describe("TasksRepository delete method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.findByIdAndDelete method
    mockTasksModel.findByIdAndDelete = jest.fn().mockResolvedValue(fakeDeletedTask)
    mockTasksModel.modelName = 'Task'
  })

  it("should call the findByIdAndDelete method of the model with no arguments and 'redis.keys' with correct pattern", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce([])

    await tasksRepository.delete('1')

    expect(mockRedis.keys).toHaveBeenCalledWith('Task:*')
    expect(mockTasksModel.findByIdAndDelete).toHaveBeenCalledWith('1')
  })

  it("should return the result of the model's findByIdAndDelete method and not call 'redis.del' if length is ==== 0", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce([])
    mockRedis.del = jest.fn()

    const result = await tasksRepository.delete('1')

    expect(mockRedis.del).not.toHaveBeenCalled()
    expect(result).toEqual(fakeDeletedTask)
  })

  it("Should call 'redis.del' method with keys array if redisKeys length is > 0", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce(['test'])
    mockRedis.del = jest.fn().mockResolvedValueOnce(1)

    await tasksRepository.delete('1')

    expect(mockRedis.del).toHaveBeenCalledWith(['test'])
  })
})