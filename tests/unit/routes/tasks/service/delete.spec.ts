import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const taskService = new TasksService(mockTasksRepository)

const fakeDeletedTask = {
  _id: '1',
  boardId: 1,
  status: 'todo',
  title: 'some todo task',
  description: 'todo description',
  members: ['John', 'Jane'],
  tags: ['not so important']
}

describe("TasksRepository delete method unit tests", () => {
  beforeAll(() => { // mock the return value of the tasksRepository.delete method
    mockTasksRepository.delete = jest.fn().mockResolvedValue(fakeDeletedTask)
  })

  it("should call the delete method of the repository with no arguments", async () => {
    await taskService.delete('1')

    expect(mockTasksRepository.delete).toHaveBeenCalledWith('1')
  })

  it("should return the result of the repository's delete method", async () => {
    const result = await taskService.delete('1')

    expect(result).toEqual(fakeDeletedTask)
  })
})