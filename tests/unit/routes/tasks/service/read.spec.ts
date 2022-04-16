import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const tasksService = new TasksService(mockTasksRepository)

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

describe("TasksService read method unit tests", () => {
  beforeAll(() => { // mock the return value of the tasksRepository.read method
    mockTasksRepository.read = jest.fn().mockResolvedValue(fakeTaskResponse)
  })

  it("should call the read method of the repository with no arguments", async () => {
    await tasksService.read()

    expect(mockTasksRepository.read).toHaveBeenCalledWith()
  })

  it("should return the result of the repository's read method", async () => {
    const result = await tasksService.read()

    expect(result).toEqual(fakeTaskResponse)
  })
})