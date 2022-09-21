import { describe, it, expect, beforeAll, vi } from 'vitest'
import { Request, Response } from 'express'
import { TasksController } from "../../../../../src/routes/tasks/Controller"
import { MockTasksService } from "../../../../__mocks__"

const mockTasksService = new MockTasksService()
const tasksController = new TasksController(mockTasksService)

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

describe("TasksController updateMembers method unit tests", () => {
  const mockReq = {} as Request
  const mockRes = {} as Response

  beforeAll(() => {
    // mock the return value of the tasksService.updateMembers method
    mockTasksService.updateMembers = vi.fn()
      .mockResolvedValueOnce(fakeUpdatedTask) // first call
      .mockResolvedValueOnce(fakeUpdatedTask) // second call
      .mockResolvedValueOnce(null) // third call

    // Just like the real express response object, here I'm mocking status method
    // to return theresponse object so that the json method can be chained with it.
    mockRes.status = vi.fn().mockReturnValue(mockRes)
    mockRes.json = vi.fn()
  })

  mockReq.params = { id: '1'}
  mockReq.body = { operation: 1, value: 'test' }

  it("should call the updateMembers method of the service with req.params.id, req.body.operations and req.body.value", async () => {
    await tasksController.updateMembers(mockReq, mockRes)

    expect(mockTasksService.updateMembers).toHaveBeenCalledWith(mockReq.params.id, mockReq.body.operation, mockReq.body.value)
  })

  describe('When the task is found', () => {
    it("should call res.status with 200 and res.json with the result of service's updateMembers method", async () => {
      await tasksController.updateMembers(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(fakeUpdatedTask)
    })
  })

  describe('When the task is not found', () => {
    it("should call res.status with 404 and res.json with 'Task not found' message", async () => {
      await tasksController.updateMembers(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task not found' })
    })
  })
})