import { Controller } from '../../ts/abstract_classes'
import { ITask } from '../../ts/interfaces'

// This is the class that will be used to handle everything relate to http requests for the tasks;
// It has the same methods as the abstract Controller class, but it uses a "TasksService" instance
// provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksController extends Controller<ITask> {}
