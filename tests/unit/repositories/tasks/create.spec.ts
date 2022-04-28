import { Redis } from "ioredis"
import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const mockRedis = {} as jest.Mocked<Redis>
const tasksRepository = new TasksRepository(mockTasksModel, mockRedis)

const fakeTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

describe("TasksRepository create method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.create method
    mockTasksModel.create = jest.fn().mockResolvedValue({ ...fakeTask, _id: 'test' })
    mockTasksModel.modelName = 'Task'
  })

  it("should call the create method of the model with data received as argument and 'redis.keys' with correct pattern", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce([])

    await tasksRepository.create(fakeTask)

    expect(mockRedis.keys).toHaveBeenCalledWith('Task:*')
    expect(mockTasksModel.create).toHaveBeenCalledWith(fakeTask)
  })

  it("should return the result of the model's create method and not call 'redis.del' if length is === 0", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce([])
    mockRedis.del = jest.fn()

    const result = await tasksRepository.create(fakeTask)

    expect(mockRedis.del).not.toHaveBeenCalled()
    expect(result).toEqual({ ...fakeTask, _id: 'test' })
  })

  it("Should call 'redis.del' method with keys array if redisKeys length is > 0", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce(['test'])
    mockRedis.del = jest.fn().mockResolvedValueOnce(1)

    await tasksRepository.create(fakeTask)

    expect(mockRedis.del).toHaveBeenCalledWith(['test'])
  })
})