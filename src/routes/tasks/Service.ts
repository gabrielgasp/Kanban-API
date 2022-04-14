import { AbstractService } from '../../ts/abstract_classes'
import { ITask } from '../../ts/interfaces'

// This is the class that will be used to handle business logic for the tasks;
// It has the same methods as the abstract Service class, but it uses a "TaskRepository" instance provided as argument
// to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksService extends AbstractService<ITask> {}
