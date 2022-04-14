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
  members: ['test'],
  tags: ['test']
}

describe("TasksController update method unit tests", () => {
  const mockReq = {} as Request
  const mockRes = {} as Response

  beforeAll(() => {
    // mock the return value of the tasksService.update method
    mockTasksService.update = jest.fn()
      .mockResolvedValueOnce(fakeUpdatedTask) // first call
      .mockResolvedValueOnce(fakeUpdatedTask) // second call
      .mockResolvedValueOnce(null) // third call

    // Just like the real express response object, here I'm mocking status method
    // to return theresponse object so that the json method can be chained with it.
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()
  })

  mockReq.params = { id: '1'}
  mockReq.body = { status: 'in_progress' }

  it("should call the update method of the service with req.params.id and req.body", async () => {
    await tasksController.update(mockReq, mockRes)

    expect(mockTasksService.update).toHaveBeenCalledWith(mockReq.params.id, mockReq.body)
  })

  describe('When the task is found', () => {
    it("should call res.status with 200 and res.json with the result of service's update method", async () => {
      const result = await tasksController.update(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(fakeUpdatedTask)
    })
  })

  describe('When the task is not found', () => {
    it("should call res.status with 404 and res.json with 'Task not found' message", async () => {
      const result = await tasksController.update(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task not found' })
    })
  })
})