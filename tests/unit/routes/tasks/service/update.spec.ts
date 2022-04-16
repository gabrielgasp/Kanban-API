import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const taskService = new TasksService(mockTasksRepository)

const updateData = { status: 'in_progress' }

const fakeUpdatedTask = {
  _id: '1',
  boardId: 1,
  status: 'in_progress',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

describe("TasksService update method unit tests", () => {
  beforeAll(() => { // mock the return value of the tasksRepository.update method
    mockTasksRepository.update = jest.fn().mockResolvedValue(fakeUpdatedTask)
  })

  it("should call the update method of the repository with id and new values", async () => {
    await taskService.update('1', updateData)

    expect(mockTasksRepository.update).toHaveBeenCalledWith('1', updateData)
  })

  it("should return the result of the repository's update method", async () => {
    const result = await taskService.update('1', updateData)

    expect(result).toEqual(fakeUpdatedTask)
  })
})