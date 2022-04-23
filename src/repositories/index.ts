import { taskModel } from '../database'
import { TasksRepository } from './TasksRepository'

export const tasksRepository = new TasksRepository(taskModel)

/*
In this file we instantiate and export all our repositories in a singleton pattern.
This allow our entire application to import and use them without having to create new instances of them.
*/
