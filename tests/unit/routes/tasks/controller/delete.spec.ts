import { Request, Response } from 'express'
import { TasksController } from "../../../../../src/routes/tasks/Controller"
import { MockTasksService } from "../../../../__mocks__"

const mockTasksService = new MockTasksService()
const tasksController = new TasksController(mockTasksService)

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

describe("TasksController delete method unit tests", () => {
  const mockReq = {} as Request
  const mockRes = {} as Response

  beforeAll(() => {
    // mock the return value of the tasksService.delete method
    mockTasksService.delete = jest.fn()
      .mockResolvedValueOnce(fakeDeletedTask) // first call
      .mockResolvedValueOnce(fakeDeletedTask) // second call
      .mockResolvedValueOnce(null) // third call

    // Just like the real express response object, here I'm mocking status method
    // to return theresponse object so that the json method can be chained with it.
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()
  })

  mockReq.params = { id: '1'}

  it("should call the delete method of the service with req.params.id and req.body", async () => {
    await tasksController.delete(mockReq, mockRes)

    expect(mockTasksService.delete).toHaveBeenCalledWith(mockReq.params.id)
  })

  describe('When the task is found', () => {
    it("should call res.status with 200 and res.json with the result of service's delete method", async () => {
      await tasksController.delete(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(fakeDeletedTask)
    })
  })

  describe('When the task is not found', () => {
    it("should call res.status with 404 and res.json with 'Task not found' message", async () => {
      await tasksController.delete(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task not found' })
    })
  })
})