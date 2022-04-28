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
  members: [],
  tags: []
}

const fakeId = '5e9f8f9b8f9b8f9b8f9b8f9b'

describe('Tasks updateMembers endpoint integration tests', () => {
  let mongod: MongoMemoryServer;
  let taskId: string

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create() // Here we create the mongoDB instance in memory so we can test without using our database (and it's really fast)
    const uri = mongod.getUri() // Get the URI of the database we just created
    await mongoose.connect(uri) // Here we connect to the mongoDB instance in memory so our application can use it
    const { _id } = await taskModel.create(task)
    taskId = _id
  })
  
  afterAll(async () => {
    await mongoose.connection.close() // Here we close the connection to the mongoDB instance in memory
    await mongod.stop() // Here we stop the mongoDB instance in memory
    redis.disconnect() // Here we disconnect the redis client
  })

  describe('When operation successfully adds a member', () => {
    it('Should 200 with updated task data', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: 1, value: 'teste' } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, members: ['teste'] })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')
    })

    it('Should have updated members in the database collection', async () => {
      const taskInDatabase = await taskModel.findById(taskId)

      expect(taskInDatabase?.members).toEqual(['teste'])
    })
  })
  describe('When operation successfully removes a member', () => {
    it('Should 200 with updated task data', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: -1, value: 'teste' } })
      
      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, members: [] })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')
    })

    it('Should have updated members in the database collection', async () => {
      const taskInDatabase = await taskModel.findById(taskId)

      expect(taskInDatabase?.members).toEqual([])
    })

    it('Should clear redis cache if exists', async () => {
      const redisKey = `${taskModel.modelName}:test`

      await redis.set(redisKey, 'test') // Here we set a value in redis so we can test if it's cleared after the task is created

      expect(await redis.get(redisKey)).toBe('test') // Check if the value is set before request
      await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: -1, value: 'teste' } }) // Here we make the request
      expect(await redis.get(redisKey)).toBeNull() // Check if the value is cleared after request
    })
  })

  describe('When operation fails', () => {
    it('Should 404 when trying to update a task that does not exist', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/000000000000000000000000/members`, { method: 'patch', body: { operation: 1, value: 'value' } })

      expect(status).toBe(404)
      expect(body.message).toBe('Task not found')
    })

    it('Should 400 with message and provided ID is not a valid ObjectId', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/123/members`, { method: 'patch' }) // path id validation happens before body, that's why I'm not passing any body

      expect(status).toBe(400)
      expect(body.message).toBe('"id" must be a valid ObjectId' )
    })

    it('Should 400 with message when trying to update without an operation', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: undefined, value: 'value' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"operation" is required')
    })

    it('Should 400 with message when trying to update with invalid operation', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: 'invalid', value: 'value' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"operation" must be 1 (add) or -1 (remove)')
    })

    it('Should 400 with message when trying to update without a value', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: 1, value: undefined } })

      expect(status).toBe(400)
      expect(body.message).toBe('"value" is required')
    })

    it('Should 400 with message when trying to update with value that is not a string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: 1, value: 123 } })

      expect(status).toBe(400)
      expect(body.message).toBe('"value" must be a string')
    })

    it('Should 400 with message when trying to update with value that is an empty string', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/members`, { method: 'patch', body: { operation: 1, value: '' } })

      expect(status).toBe(400)
      expect(body.message).toBe('"value" can not be an empty string')
    })

    it('Should 400 with message when an unknown property is provided', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}/members`, { method: 'patch', body: { operation: 1, value: 'value', unexpectedProperty: 'hello' } })

      expect(status).toBe(400)
      expect(body.message).toBe('Unknown property: "unexpectedProperty"')
    })

    it('Should 500 with message when an unexpected error occurs', async () => {
      jest.spyOn(taskModel, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Unexpected error') as never)
      const { status, body } = await fetchEndpoint(`${endpoint}/${fakeId}/members`, { method: 'patch',  body: { operation: 1, value: 'teste' } })

      expect(status).toBe(500)
      expect(body.message).toBe('Something went wrong here, please try again later')
    })
  })
})