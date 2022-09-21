import { describe, it, expect, beforeAll, vi } from 'vitest'
import { taskModel } from "../../../../src/database"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const tasksRepository = new TasksRepository(mockTasksModel)

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
    mockTasksModel.findByIdAndDelete = vi.fn().mockResolvedValue(fakeDeletedTask)
  })

  it("should call the findByIdAndDelete method of the model with no arguments", async () => {
    await tasksRepository.delete('1')

    expect(mockTasksModel.findByIdAndDelete).toHaveBeenCalledWith('1')
  })

  it("should return the result of the model's findByIdAndDelete method", async () => {
    const result = await tasksRepository.delete('1')

    expect(result).toEqual(fakeDeletedTask)
  })
})