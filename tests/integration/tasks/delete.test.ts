import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database/mongodb'
import { redis } from '../../../src/database/redis'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

// Here I replace the ioredis import with ioredis-mock library that runs in-memory just like mongodb-memory-server.
jest.mock('ioredis', () => require('ioredis-mock'))

const task = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  priority: 1,
  members: ['test'],
  tags: ['test']
}

describe('Tasks Delete endpoint integration tests', () => {
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
    const redisKey = `${taskModel.modelName}:test`

    beforeAll(async () => {
      const [{ _id }] = await Promise.all([ // Run both operation in parallel for better performance
        taskModel.create(task), // Insert a task to be deleted
        redis.set(redisKey, 'test') // Here we set a value in redis so we can test if it was cleared after request
      ])
      taskId = _id
    })

    it('Should 200 with deleted task data and clear redis cache', async () => {
      expect(await redis.get(redisKey)).toBe('test') // Here we check if the value was set in redis before the request

      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'delete' })

      expect(await redis.get(redisKey)).toBeNull() // Here we check if the cache was cleared after the request
      expect(status).toBe(200)
      expect(body).toMatchObject(task)
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')
    })

    it('Should be removed from database collection', async () => {
      const deleteTaskInDatabase = await taskModel.findById(taskId)

      expect(deleteTaskInDatabase).toBeNull()
    })
  })

  describe('When operation fails', () => {
    it('Should 404 when trying to delete a task that does not exist', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/000000000000000000000000`, { method: 'delete' })

      expect(status).toBe(404)
      expect(body.message).toBe('Task not found')
    })

    it('Should 400 with message and provided ID is not a valid ObjectId', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/123`, { method: 'delete' }) // path id validation happens before body, that's why I'm not passing any body

      expect(status).toBe(400)
      expect(body.message).toBe('"id" must be a valid ObjectId' )
    })

    it('Should 500 with message when an unexpected error occurs', async () => {
      jest.spyOn(taskModel, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Unexpected error') as never)
      const { status, body } = await fetchEndpoint(`${endpoint}/000000000000000000000000`, { method: 'delete' })

      expect(status).toBe(500)
      expect(body.message).toBe('Something went wrong here, please try again later')
    })
  })
})