import { taskModel } from "../../../../src/database"
import { TasksRepository } from "../../../../src/repositories/TasksRepository"

const mockTasksModel = taskModel
const tasksRepository = new TasksRepository(mockTasksModel)

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

describe("TasksRepository update method unit tests", () => {
  beforeAll(() => { // mock the return value of the taskModel.findByIdAndUpdate method
    mockTasksModel.findByIdAndUpdate = jest.fn().mockResolvedValue(fakeUpdatedTask)
  })

  it("should call the findByIdAndUpdate method of the model with id, new values and option new: true", async () => {
    await tasksRepository.update('1', updateData)

    expect(mockTasksModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true })
  })

  it("should return the result of the model's findByIdAndUpdate method", async () => {
    const result = await tasksRepository.update('1', updateData)

    expect(result).toEqual(fakeUpdatedTask)
  })
})