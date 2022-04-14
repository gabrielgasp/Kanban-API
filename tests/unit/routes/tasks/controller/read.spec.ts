import { Request, Response } from 'express'
import { TasksController } from "../../../../../src/routes/tasks/Controller"
import { MockTasksService } from "../../../../__mocks__"

const mockTasksService = new MockTasksService()
const tasksController = new TasksController(mockTasksService)

const fakeTaskResponse = [
  {
    _id: '1',
    boardId: 1,
    status: 'todo',
    title: 'some todo task',
    description: 'todo description',
    members: ['John', 'Jane'],
    tags: ['not so important']
  },
  {
    _id: '2',
    boardId: 1,
    status: 'in_progress',
    title: 'some task in progress',
    description: 'task in progress description',
    members: ['John', 'Jane'],
    tags: ['important']
  }
]

describe("TasksController read method unit tests", () => {
  const mockReq = {} as Request
  const mockRes = {} as Response

  beforeAll(() => {
    // mock the return value of the tasksService.read method
    mockTasksService.read = jest.fn().mockResolvedValue(fakeTaskResponse)

    // Just like the real express json, here I'm mocking status method to return the
    // response object so that the json method can be chained with it.
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()
  })

  mockReq.body = fakeTaskResponse

  it("should call the read method of the service with no arguments", async () => {
    await tasksController.read(mockReq, mockRes)

    expect(mockTasksService.read).toHaveBeenCalledWith()
  })

  it("should call res.status with 200 and res.json with the result of service's read method", async () => {
    const result = await tasksController.read(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(fakeTaskResponse)
  })
})