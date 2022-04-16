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
    priority: 1,
    members: ['John', 'Jane'],
    tags: ['not so important']
  },
  {
    _id: '2',
    boardId: 1,
    status: 'in_progress',
    title: 'some task in progress',
    description: 'task in progress description',
    priority: 1,
    members: ['John', 'Jane'],
    tags: ['important']
  }
]

describe("TasksController readFromBoard method unit tests", () => {
  const mockReq = {} as Request
  const mockRes = {} as Response

  beforeAll(() => {
    // mock the return value of the tasksService.readFromBoard method
    mockTasksService.readFromBoard = jest.fn()
      .mockResolvedValueOnce(fakeTaskResponse) // first call
      .mockResolvedValueOnce(fakeTaskResponse) // second call
      .mockResolvedValueOnce([]) // third call

    // Just like the real express response object, here I'm mocking status method
    // to return theresponse object so that the json method can be chained with it.
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()
  })

  mockReq.body = fakeTaskResponse
  mockReq.params = { boardId: '1' }

  it("should call the readFromBoard method of the service with boardId as a number", async () => {
    await tasksController.readFromBoard(mockReq, mockRes)

    expect(mockTasksService.readFromBoard).toHaveBeenCalledWith(mockReq.params.boardId)
  })

  describe('When board exist and there are tasks in it', () => {
    it("should call res.status with 200 and res.json with the result of service's readFromBoard method", async () => {
      await tasksController.readFromBoard(mockReq, mockRes)
  
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(fakeTaskResponse)
    })
  })

  describe('When board does not exist or there are no tasks in it', () => {
    it("should call res.status with 404 and res.json with message", async () => {
      await tasksController.readFromBoard(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No tasks were found for the boardId provided, please make sure that the board exist and have tasks'
      })
    })
  })
})