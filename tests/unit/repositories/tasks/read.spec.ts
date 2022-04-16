import { taskModel } from "../../../../src/database"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const tasksRepository = new TasksRepository(mockTasksModel)

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
    boardId: 2,
    status: 'in_progress',
    title: 'some task in progress',
    description: 'task in progress description',
    priority: 1,
    members: ['John', 'Jane'],
    tags: ['important']
  }
]

describe("TasksRepository read method unit tests", () => {
  const findChainableMethods = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(fakeTaskResponse),
  }
  beforeAll(() => { // Here I'm mocking all external methods used in the TasksRepository read method
    mockTasksModel.find = jest.fn().mockReturnValue(findChainableMethods)
  })

  it("should call the model methods with the expected arguments", async () => {
    await tasksRepository.read(0, 5)

    expect(mockTasksModel.find).toHaveBeenCalledWith()
    expect(mockTasksModel.find().sort).toHaveBeenCalledWith({ boardId: 1, status: 1, priority: -1 })
    expect(mockTasksModel.find().sort({}).skip).toHaveBeenCalledWith(0)
    expect(mockTasksModel.find().sort({}).skip(0).limit).toHaveBeenCalledWith(5)
  })

  it("should return the result of the model's sort method", async () => {
    const result = await tasksRepository.read(0, 5)

    expect(result).toEqual(fakeTaskResponse)
  })
})