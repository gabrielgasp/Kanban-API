import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database/mongodb'
import { redis } from '../../../src/database/redis'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

// Here I replace the ioredis import with ioredis-mock library that runs in-memory just like mongodb-memory-server.
jest.mock('ioredis', () => require('ioredis-mock'))

let task = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

const fakeId = '5e9f8f9b8f9b8f9b8f9b8f9b'

describe('Tasks Update endpoint integration tests', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create() // Here we create the mongoDB instance in memory so we can test without using our database (and it's really fast)
    const uri = mongod.getUri() // Get the URI of the database we just created
    await mongoose.connect(uri) // Here we connect to the mongoDB instance in memory so our application can use it
  })
  
  afterAll(async () => {
    await mongoose.connection.close() // Here we close the connection to the mongoDB instance in memory
    await mongod.stop() // Here we stop the mongoDB instance in memory
    redis.disconnect() // Here we disconnect the redis client
  })

  describe('When operation is successful', () => {
    let taskId: string

    beforeAll(async () => {
      const { _id } = await taskModel.create(task)
      taskId = _id
    })

    it('Should 200 with updated task data when updating status', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { status: 'in_progress' } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, status: 'in_progress' })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      task.status = 'in_progress' // Here we update the task object so we can keep using it as reference in the next tests
    })

    it('Should 200 with updated task data when updating title', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { title: 'new title' } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, title: 'new title' })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      task.title = 'new title'
    })

    it('Should 200 with updated task data when updating description', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { description: 'new description' } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, description: 'new description' })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      task.description = 'new description'
    })

    it('Should 200 with updated task data when updating priority', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { priority: 2 } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, priority: 2 })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      task.priority = 2
    })

    it('Should 200 with updated task data when updating members', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { members: ['new members'] } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, members: ['new members'] })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      task.members = ['new members']
    })

    it('Should 200 with updated task data when updating tags', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { tags: ['new tags'] } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, tags: ['new tags'] })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      task.tags = ['new tags']
    })

    it('Should have all fields updated in the database collection', async () => {
      const taskInDatabase = await taskModel.findById(taskId)

      expect(taskInDatabase).toMatchObject(task)
      expect((taskInDatabase as any).updatedAt.getTime()).toBeGreaterThan((taskInDatabase as any).createdAt.getTime())
    })

    it('Should clear redis cache if exists', async () => {
      const redisKey = `${taskModel.modelName}:test`

      await redis.set(redisKey, 'test') // Here we set a value in redis so we can test if it's cleared after the task is created

      expect(await redis.get(redisKey)).toBe('test') // Check if the value is set before request
      await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'patch', body: { title: 'new title' } }) // Here we make the request
      expect(await redis.get(redisKey)).toBeNull() // Check if the value is cleared after request
    })
  })

  describe('When operation fails', () => {
    it('Should 404 when trying to update a task that does not exist', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/000000000000000000000000`, { method: 'patch', body: { status: 'in_progress' } })

      expect(status).toBe(404)
      expect(body.message).toBe('Task not found')
    })

    it('Should 400 with message and provided ID is not a valid ObjectId', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/123`, { method: 'patch' }) // path id validation happens before body, that's why I'm not passing any body

      expect(status).toBe(400)
      expect(body.message).toBe('"id" must be a valid ObjectId' )
    })

    it('Should 400 with message when trying to update boardId', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { boardId: 2 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"boardId" can not be updated')
    })

    it('Should 400 with message when status is not a string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { status: 1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"status" must be a string')
    })

    it('Should 400 with message when status is an empty string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { status: "" } })

      expect(status).toBe(400)
      expect(body.message).toBe('"status" can not be an empty string')
    })

    it('Should 400 with message when title is not a string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { title: 1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"title" must be a string')
    })

    it('Should 400 with message when title is an empty string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { title: "" } })

      expect(status).toBe(400)
      expect(body.message).toBe('"title" can not be an empty string')
    })

    it('Should 400 with message when description is not a string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { description: 1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"description" must be a string')
    })

    it('Should 400 with message when priority is not a number', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...task, priority: 'test' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer')
    })

    it('Should 400 with message when priority is not an integer', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...task, priority: 1.5 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer')
    })

    it('Should 400 with message when priority is less than 1', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...task, priority: 0 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer between 1 and 5')
    })

    it('Should 400 with message when priority is greater than 5', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...task, priority: 6 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer between 1 and 5')
    })

    it('Should 400 with message when members is not an array', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { members: 'member' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"members" must be an array')
    })

    it('Should 400 with message when a members item is not a string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { members: [1] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"members[0]" must be a string')
    })

    it('Should 400 with message when a members item is an empty string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { members: [""] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"members[0]" can not be an empty string')
    })

    it('Should 400 with message when tags is not an array', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { tags: 'tag' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"tags" must be an array')
    })

    it('Should 400 with message when a tags item is not a string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { tags: [1] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"tags[0]" must be a string')
    })

    it('Should 400 with message when a tags item is an empty string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { tags: [""] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"tags[0]" can not be an empty string')
    })

    it('Should 400 with message when no fields are provided (empty body)', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch' })

      expect(status).toBe(400)
      expect(body.message).toBe('You must provide at least one field to update')
    })

    it('Should 400 with message when an unknown property is provided', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch', body: { unexpectedProperty: 'hello' } })

      expect(status).toBe(400)
      expect(body.message).toBe('Unknown property: "unexpectedProperty"')
    })

    it('Should 500 with message when an unexpected error occurs', async () => {
      jest.spyOn(taskModel, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Unexpected error') as never)
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}`, { method: 'patch',  body: { tags: ['new tags'] } })

      expect(status).toBe(500)
      expect(body.message).toBe('Something went wrong here, please try again later')
    })
  })
})