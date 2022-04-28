import { TasksRepository } from "../../../../src/repositories/TasksRepository";

// This is a mock of the TasksRepository that we can use during tests to
// create an instance of the TasksService and test its methods.

export class MockTasksRepository extends TasksRepository {
  constructor () {
    super(
      {} as any, // I don't need to pass the real tasksModel because we will not use it
      {} as any // I don't need to pass the real redis because we will not use it
    ) 
  }

  // Here I override all methods from the original TasksRepository class
  // and turn them into empty mocks.

  public countDocuments = jest.fn()
  public create = jest.fn()
  public read = jest.fn()
  public readFromBoard = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
  public updateMembers = jest.fn()
  public updateTags = jest.fn()
}