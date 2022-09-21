import { describe, it, expect, beforeAll, vi } from 'vitest'
import { taskModel } from "../../../../src/database"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const tasksRepository = new TasksRepository(mockTasksModel)

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
  beforeAll(() => { // mock the return value of the taskModel.findByIdAndUpdate method
    mockTasksModel.findByIdAndUpdate = vi.fn()
      .mockResolvedValueOnce({ ...fakeUpdatedTask, members: ['test'] }) // mock the first call
      .mockResolvedValueOnce({ ...fakeUpdatedTask, members: ['test'] }) // mock the second call
      .mockResolvedValueOnce({ ...fakeUpdatedTask, members: [] }) // mock the third call
      .mockResolvedValueOnce({ ...fakeUpdatedTask, members: [] }) // mock the fourth call

  })

  describe('When operation is $addToSet', () => {
    it("should call the findByIdAndUpdate method of the model with id, $addToSet, value and option new: true", async () => {
      await tasksRepository.updateMembers('1', "$addToSet", 'test')
  
      expect(mockTasksModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { $addToSet: { members: 'test' } }, { new: true })
    })

    it("should return the result of the model's findByIdAndUpdate method", async () => {
      const result = await tasksRepository.updateMembers('1', '$addToSet', 'test')
  
      expect(result).toEqual({ ...fakeUpdatedTask, members: ['test'] })
    })
  })

  describe('When operation is -1', () => {
    it("should call the findByIdAndUpdate method of the model with id, $pull, value and option new: true", async () => {
      await tasksRepository.updateMembers('1', '$pull', 'test')
  
      expect(mockTasksModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { $pull: { members: 'test' } }, { new: true })
    })

    it("should return the result of the model's findByIdAndUpdate method", async () => {
      const result = await tasksRepository.updateMembers('1', '$pull', 'test')
  
      expect(result).toEqual({ ...fakeUpdatedTask, members: [] })
    })
  })
})