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
  beforeAll(() => { // mock the return value of the taskModel.find method
    mockTasksModel.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakeTaskResponse)
    })
  })

  it("should call the find method of the model with boardId and sort method with sorting arguments", async () => {
    await tasksRepository.read()

    expect(mockTasksModel.find).toHaveBeenCalledWith()
    expect(mockTasksModel.find().sort).toHaveBeenCalledWith({ boardId: 1, status: 1, priority: -1 })
  })

  it("should return the result of the model's sort method", async () => {
    const result = await tasksRepository.read()

    expect(result).toEqual(fakeTaskResponse)
  })
})