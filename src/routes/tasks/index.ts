import { tasksRepository } from '../../repositories'
import { TasksController } from './Controller'
import { TasksRouter } from './Router'
import { TasksService } from './Service'
import * as middlewares from '../../middlewares'
import * as validators from '../../validators'

const tasksService = new TasksService(tasksRepository)
const tasksController = new TasksController(tasksService)

export const tasksRouter = new TasksRouter(tasksController, middlewares, validators).router

/*
  Here is where the magic happens and all the layers of our application are connected.
  We create instances of every layer of our route, injecting them with whatever they need to work.
  You can see that it's kind of domino effect where we import all repositories instances that we need
  for this particular route and we instanciate our service injecting them.
  We do that until we instanciate the router class and export the express router that is inside the router instance.

  You might be curious about why we are not instanciating the repository here as well.
  The reason is quite simples actually, contrary to the other layers of our application that are directly
  linked to the endpoints (/tasks, /users, etc). Repositories are not related exclusively to the endpoints
  they share name with, but with the database tables/collections and can be used in multiple groups of endpoints.
  Imagine endpoints for admins, we would have a service, controller and router specifically for admins, but
  these operations could use multiple repositories because they need access to multiple tables/collections.
  For this reason alone that repositories are instanciated elsewhere (repositories/index.ts) and just imported
  here.
*/
