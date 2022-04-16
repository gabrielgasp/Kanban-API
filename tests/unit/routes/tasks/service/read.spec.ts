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
  beforeAll(() => {
    mockTasksRepository.read = jest.fn().mockResolvedValue(fakeTaskResponse) // mock the return value of the tasksRepository.read method
    mockTasksRepository.countDocuments = jest.fn() // Here we are mocking the return on countDocuments method according to what the test needs.
    .mockResolvedValueOnce(20) // First call
    .mockResolvedValueOnce(20) // Second call
    .mockResolvedValueOnce(20) // Third call
    .mockResolvedValueOnce(20) // Fourth call
    .mockResolvedValueOnce(9) // Fifth call
  })

  it("should call the read method of the repository with skip and limit arguments", async () => {
    await tasksService.read('1', '5')

    expect(mockTasksRepository.read).toHaveBeenCalledWith(0, 5)
  })

  describe('When there is a previous page', () => {
    it('should return an object with property data and property previousPage', async () => {
      const result = await tasksService.read('2', '5')

      expect(result).toMatchObject({ data: fakeTaskResponse, previousPage: 1 })
    })
  })

  describe('When there is no previousPage', () => {
    it('should return an object with property data and no property previousPage', async () => {
      const result = await tasksService.read('1', '5')

      expect(result).toMatchObject({ data: fakeTaskResponse, previousPage: undefined })
    })
  })

  describe('When there is a next page', () => {
    it('should return an object with property data and property nextPage', async () => {
      const result = await tasksService.read('1', '5')

      expect(result).toMatchObject({ data: fakeTaskResponse, nextPage: 2 })
    })
  })

  describe('When there is no nextPage', () => {
    it('should return an object with property data and no property nextPage', async () => {
      const result = await tasksService.read('2', '5')

      expect(result).toMatchObject({ data: fakeTaskResponse, nextPage: undefined })
    })
  })
})