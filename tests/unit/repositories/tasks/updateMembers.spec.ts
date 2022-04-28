import { Redis } from "ioredis"
import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const mockRedis = {} as jest.Mocked<Redis>
const tasksRepository = new TasksRepository(mockTasksModel, mockRedis)

const fakeUpdatedTask = {
  _id: '1',
  boardId: 1,
  status: 'in_progress',
  title: 'test',
  description: 'test',
  priority: 1,
  members: [],
  tags: []
}

describe("TasksRepository updateMembers method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.modelName property
    mockTasksModel.modelName = 'Task'
  })

  describe('When operation is 1', () => {
    it("should call the findByIdAndUpdate method of the model with id, $addToSet, value, option new: true and 'redis.keys' with correct pattern", async () => {
      mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...fakeUpdatedTask, members: ['test'] })
      mockRedis.keys = jest.fn().mockResolvedValueOnce([])

      await tasksRepository.updateMembers('1', "$addToSet", 'test')

      expect(mockRedis.keys).toHaveBeenCalledWith('Task:*')
      expect(mockTasksModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { $addToSet: { members: 'test' } }, { new: true })
    })

    it("should return the result of the model's findByIdAndUpdate method and not call 'redis.del' if length is === 0", async () => {
      mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...fakeUpdatedTask, members: ['test'] })
      mockRedis.keys = jest.fn().mockResolvedValueOnce([])
      mockRedis.del = jest.fn()

      const result = await tasksRepository.updateMembers('1', '$addToSet', 'test')
  
      expect(mockRedis.del).not.toHaveBeenCalled()
      expect(result).toEqual({ ...fakeUpdatedTask, members: ['test'] })
    })

    it("Should call 'redis.del' method with keys array if redisKeys length is > 0", async () => {
      mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...fakeUpdatedTask, members: ['test'] })
      mockRedis.keys = jest.fn().mockResolvedValueOnce(['test'])
      mockRedis.del = jest.fn().mockResolvedValueOnce(1)

      await tasksRepository.updateMembers('1', '$addToSet', 'test')

      expect(mockRedis.del).toHaveBeenCalledWith(['test'])
    })
  })

  describe('When operation is -1', () => {
    it("should call the findByIdAndUpdate method of the model with id, $pull, value, option new: true and 'redis.keys' with correct pattern", async () => {
      mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...fakeUpdatedTask, members: [] })
      mockRedis.keys = jest.fn().mockResolvedValueOnce([])

      await tasksRepository.updateMembers('1', '$pull', 'test')
  
      expect(mockRedis.keys).toHaveBeenCalledWith('Task:*')
      expect(mockTasksModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { $pull: { members: 'test' } }, { new: true })
    })

    it("should return the result of the model's findByIdAndUpdate method and not call 'redis.del' if length is === 0", async () => {
      mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...fakeUpdatedTask, members: [] })
      mockRedis.keys = jest.fn().mockResolvedValueOnce([])
      mockRedis.del = jest.fn()

      const result = await tasksRepository.updateMembers('1', '$pull', 'test')

      expect(mockRedis.del).not.toHaveBeenCalled()
      expect(result).toEqual({ ...fakeUpdatedTask, members: [] })
    })

    it("Should call 'redis.del' method with keys array if redisKeys length is > 0", async () => {
      mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({ ...fakeUpdatedTask, members: [] })
      mockRedis.keys = jest.fn().mockResolvedValueOnce(['test'])
      mockRedis.del = jest.fn().mockResolvedValueOnce(1)

      await tasksRepository.updateMembers('1', '$pull', 'test')

      expect(mockRedis.del).toHaveBeenCalledWith(['test'])
    })
  })
})