import { taskModel } from "../../../../src/database/mongodb"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const tasksRepository = new TasksRepository(mockTasksModel)

const fakeTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

describe("TasksRepository create method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.create method
    mockTasksModel.create = jest.fn().mockResolvedValue({ ...fakeTask, _id: 'test' })
  })

  it("should call the create method of the model with data received as argument", async () => {
    await tasksRepository.create(fakeTask)

    expect(mockTasksModel.create).toHaveBeenCalledWith(fakeTask)
  })

  it("should return the result of the model's create method", async () => {
    const result = await tasksRepository.create(fakeTask)

    expect(result).toEqual({ ...fakeTask, _id: 'test' })
  })
})