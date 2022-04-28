import { Redis } from "ioredis"
import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const mockRedis = {} as jest.Mocked<Redis>
const tasksRepository = new TasksRepository(mockTasksModel, mockRedis)

const updateData = { status: 'in_progress' }

const fakeUpdatedTask = {
  _id: '1',
  boardId: 1,
  status: 'in_progress',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

describe("TasksRepository update method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.findByIdAndUpdate method
    mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValue(fakeUpdatedTask)
    mockTasksModel.modelName = 'Task'
  })

  it("should call the findByIdAndUpdate method of the model with id, new values, option new: true and 'redis.keys' with correct pattern", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce([])

    await tasksRepository.update('1', updateData)

    expect(mockRedis.keys).toHaveBeenCalledWith('Task:*')
    expect(mockTasksModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true })
  })

  it("should return the result of the model's findByIdAndUpdate method and not call 'redis.del' is length is === 0", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce([])
    mockRedis.del = jest.fn()

    const result = await tasksRepository.update('1', updateData)

    expect(mockRedis.del).not.toHaveBeenCalled()
    expect(result).toEqual(fakeUpdatedTask)
  })

  it("Should call 'redis.del' method with keys array if redisKeys length is > 0", async () => {
    mockRedis.keys = jest.fn().mockResolvedValueOnce(['test'])
    mockRedis.del = jest.fn().mockResolvedValueOnce(1)

    await tasksRepository.update('1', updateData)

    expect(mockRedis.del).toHaveBeenCalledWith(['test'])
  })
})