import { taskModel } from "../../../../src/database"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const tasksRepository = new TasksRepository(mockTasksModel)

const fakePaginationResponse = {
  docs: [
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
  ],
  totalDocs: 2,
  limit: 10,
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
}

describe("TasksRepository read method unit tests", () => {
  beforeAll(() => { // Here I'm mocking the model's paginate method used in the TasksRepository read method
    mockTasksModel.paginate = jest.fn().mockResolvedValue(fakePaginationResponse)
  })

  it("should call the model paginate method with the expected arguments", async () => {
    await tasksRepository.read(1, 5)

    expect(mockTasksModel.paginate).toHaveBeenCalledWith({}, { page: 1, limit: 5, sort: { boardId: 1, status: 1, priority: -1 } })
  })

  it("should return the result of the model's paginate method", async () => {
    const result = await tasksRepository.read(1, 5)

    expect(result).toEqual(fakePaginationResponse)
  })
})