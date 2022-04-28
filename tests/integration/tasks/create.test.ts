import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database/mongodb'
import { redis } from '../../../src/database/redis'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

// Here I replace the ioredis import with ioredis-mock library that runs in-memory just like mongodb-memory-server.
jest.mock('ioredis', () => require('ioredis-mock'))

const newTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

describe('Tasks Create endpoint integration tests', () => {
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
    let createdTasksIds: string[] = []

    it('Should 201 with created task data when creating a task with all fields', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: newTask })

      expect(status).toBe(201)
      expect(body).toMatchObject(newTask)
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      createdTasksIds.push(body._id) // We save the id of the created task so we can use it in a later test
    })

    it('Should 201 with created task data when creating a task without description', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: {...newTask, description: undefined } })

      expect(status).toBe(201)
      expect(body.description).toBe('')
      expect(body).toHaveProperty('_id')

      createdTasksIds.push(body._id) // We save the id of the created task so we can use it in a later test
    })

    it('Should 201 with created task data when creating a task without members', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: {...newTask, members: undefined } })

      expect(status).toBe(201)
      expect(body.members).toEqual([])
      expect(body).toHaveProperty('_id')

      createdTasksIds.push(body._id) // We save the id of the created task so we can use it in a later test
    })

    it('Should 201 with created task data when creating a task without tags', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: {...newTask, tags: undefined } })

      expect(status).toBe(201)
      expect(body.tags).toEqual([])
      expect(body).toHaveProperty('_id')

      createdTasksIds.push(body._id) // We save the id of the created task so we can use it in a later test
    })

    it('All tasks should exist in the database', async () => {
      const tasks = await taskModel.find()

      tasks.forEach(({_id}) => {
        expect(createdTasksIds).toContain(_id.toString())
      })
    })

    it('Should clear redis cache if exists', async () => {
      const redisKey = `${taskModel.modelName}:test`

      await redis.set(redisKey, 'test') // Here we set a value in redis so we can test if it's cleared after the task is created

      expect(await redis.get(redisKey)).toBe('test') // Check if the value is set before request
      await fetchEndpoint(endpoint, { method: 'post', body: newTask })
      expect(await redis.get(redisKey)).toBeNull() // Check if the value is cleared after request
    })
  })

  describe('When operation fails', () => {
    it('Should 400 with message when boardId is not provided', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, boardId: undefined } })

      expect(status).toBe(400)
      expect(body.message).toBe('"boardId" is required')
    })

    it('Should 400 with message when boardId is not a number', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, boardId: 'test' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"boardId" must be a positive integer')
    })

    it('Should 400 with message when boardId is not an integer', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, boardId: 1.5 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"boardId" must be a positive integer')
    })

    it('Should 400 with message when boardId is negative', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, boardId: -1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"boardId" must be a positive integer')
    })

    it('Should 400 with message when status is not provided', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, status: undefined } })

      expect(status).toBe(400)
      expect(body.message).toBe('"status" is required')
    })

    it('Should 400 with message when status is not a string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, status: 1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"status" must be a string')
    })

    it('Should 400 with message when status is an empty string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, status: "" } })

      expect(status).toBe(400)
      expect(body.message).toBe('"status" can not be an empty string')
    })

    it('Should 400 with message when title is not provided', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, title: undefined } })

      expect(status).toBe(400)
      expect(body.message).toBe('"title" is required')
    })

    it('Should 400 with message when title is not a string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, title: 1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"title" must be a string')
    })

    it('Should 400 with message when title is an empty string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, title: "" } })

      expect(status).toBe(400)
      expect(body.message).toBe('"title" can not be an empty string')
    })

    it('Should 400 with message when description is not a string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, description: 1 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"description" must be a string')
    })

    it('Should 400 with message when priorty is not provided', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, priority: undefined } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" is required')
    })

    it('Should 400 with message when priority is not a number', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, priority: 'test' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer')
    })

    it('Should 400 with message when priority is not an integer', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, priority: 1.5 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer')
    })

    it('Should 400 with message when priority is less than 1', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, priority: 0 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer between 1 and 5')
    })

    it('Should 400 with message when priority is greater than 5', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, priority: 6 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"priority" must be an integer between 1 and 5')
    })

    it('Should 400 with message when members is not an array', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, members: 'member' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"members" must be an array')
    })

    it('Should 400 with message when a members item is not a string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, members: [1] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"members[0]" must be a string')
    })

    it('Should 400 with message when a members item is an empty string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, members: [""] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"members[0]" can not be an empty string')
    })

    it('Should 400 with message when tags is not an array', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, tags: 'tag' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"tags" must be an array')
    })

    it('Should 400 with message when a tags item is not a string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, tags: [1] } })

      expect(status).toBe(400)
      expect(body.message).toBe('"tags[0]" must be a string')
    })

    it('Should 400 with message when a tags item is an empty string', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, tags: [""] } })
      
      expect(status).toBe(400)
      expect(body.message).toBe('"tags[0]" can not be an empty string')
    })
    
    it('Should 400 with message when an unknown property is provided', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: { ...newTask, unexpectedProperty: 'hello' } })
      
      expect(status).toBe(400)
      expect(body.message).toBe('Unknown property: "unexpectedProperty"')
    })

    it('Should 500 with message when an unexpected error occurs', async () => {
      jest.spyOn(taskModel, 'create').mockRejectedValueOnce(new Error('Unexpected error') as never)
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: newTask })

      expect(status).toBe(500)
      expect(body.message).toBe('Something went wrong here, please try again later')
    })
  })
})