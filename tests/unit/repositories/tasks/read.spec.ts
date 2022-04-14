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

describe("TasksRepository read method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.find method
    mockTasksModel.find = jest.fn().mockResolvedValue(fakeTaskResponse)
  })

  it("should call the find method of the model with no arguments", async () => {
    await tasksRepository.read()

    expect(mockTasksModel.find).toHaveBeenCalledWith()
  })

  it("should return the result of the model's find method", async () => {
    const result = await tasksRepository.read()

    expect(result).toEqual(fakeTaskResponse)
  })
})