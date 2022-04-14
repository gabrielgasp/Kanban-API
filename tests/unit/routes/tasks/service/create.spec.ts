import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const taskService = new TasksService(mockTasksRepository)

const fakeTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  members: ['test'],
  tags: ['test']
}

describe("TasksService create method unit tests", () => {
  beforeAll(() => { // mock the return value of the tasksRepository.create method
    mockTasksRepository.create = jest.fn().mockResolvedValue({ ...fakeTask, _id: 'test' })
  })

  it("should call the create method of the repository with data received as argument", async () => {
    await taskService.create(fakeTask)

    expect(mockTasksRepository.create).toHaveBeenCalledWith(fakeTask)
  })

  it("should return the result of the repository's create method", async () => {
    const result = await taskService.create(fakeTask)

    expect(result).toEqual({ ...fakeTask, _id: 'test' })
  })
})