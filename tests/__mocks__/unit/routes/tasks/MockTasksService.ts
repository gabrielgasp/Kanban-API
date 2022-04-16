import { TasksService } from "../../../../../src/routes/tasks/Service"

// This is a mock of the TasksService that we can use during tests to
// create an instance of the TasksController and test its methods.

export class MockTasksService extends TasksService {
  constructor () {
    super({} as any) // I don't need to pass the real TasksRepository because we will not use it
  }

  // Here I override all methods from the original TasksService class
  // and turn them into empty mocks.

  public create = jest.fn()
  public read = jest.fn()
  public readFromBoard = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
  public updateMembers = jest.fn()
  public updateTags = jest.fn()
}