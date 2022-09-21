import { vi } from "vitest";
import { TasksRepository } from "../../../../src/repositories/TasksRepository";

// This is a mock of the TasksRepository that we can use during tests to
// create an instance of the TasksService and test its methods.

export class MockTasksRepository extends TasksRepository {
  constructor () {
    super({} as any) // I don't need to pass the real tasksModel because we will not use it
  }

  // Here I override all methods from the original TasksRepository class
  // and turn them into empty mocks.

  public countDocuments = vi.fn()
  public create = vi.fn()
  public read = vi.fn()
  public readFromBoard = vi.fn()
  public update = vi.fn()
  public delete = vi.fn()
  public updateMembers = vi.fn()
  public updateTags = vi.fn()
}