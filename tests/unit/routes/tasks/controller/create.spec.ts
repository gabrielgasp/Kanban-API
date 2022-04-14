import { Request, Response } from 'express'
import { TasksController } from "../../../../../src/routes/tasks/Controller"
import { MockTasksService } from "../../../../__mocks__"

const mockTasksService = new MockTasksService()
const tasksController = new TasksController(mockTasksService)

const fakeTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  members: ['test'],
  tags: ['test']
}

describe("TasksController create method unit tests", () => {
  const mockReq = {} as Request
  const mockRes = {} as Response

  beforeAll(() => {
    // mock the return value of the tasksService.create method
    mockTasksService.create = jest.fn().mockResolvedValue({ ...fakeTask, _id: 'test' })

    // Just like the real express response object, here I'm mocking status method
    // to return theresponse object so that the json method can be chained with it.
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()
  })

  mockReq.body = fakeTask

  it("should call the create method of the service with req.body", async () => {
    await tasksController.create(mockReq, mockRes)

    expect(mockTasksService.create).toHaveBeenCalledWith(mockReq.body)
  })

  it("should call res.status with 201 and res.json with the result of service's create method", async () => {
    const result = await tasksController.create(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(201)
    expect(mockRes.json).toHaveBeenCalledWith({ ...fakeTask, _id: 'test' })
  })
})