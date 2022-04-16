import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

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

describe('Tasks updateTags endpoint integration tests', () => {
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
  })

  describe('When operation successfully adds a tag', () => {
    it('Should 200 with updated task data', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/tags`, { method: 'patch', body: { operation: 1, value: 'teste' } })

      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, tags: ['teste'] })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')
    })

    it('Should have updated tags in the database collection', async () => {
      const taskInDatabase = await taskModel.findById(taskId)

      expect(taskInDatabase!.tags).toEqual(['teste'])
    })
  })

  describe('When operation successfully removes a tag', () => {
    it('Should 200 with updated task data', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}/tags`, { method: 'patch', body: { operation: -1, value: 'teste' } })
      
      expect(status).toBe(200)
      expect(body).toMatchObject({ ...task, tags: [] })
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')
    })

    it('Should have updated tags in the database collection', async () => {
      const taskInDatabase = await taskModel.findById(taskId)

      expect(taskInDatabase!.tags).toEqual([])
    })
  })

  describe('When operation fails', () => {
    it('Should 404 when trying to update a task that does not exist', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/000000000000000000000000/tags`, { method: 'patch', body: { operation: 1, value: 'value' } })

      expect(status).toBe(404)
      expect(body.message).toBe('Task not found')
    })

    it('Should 400 with message and provided ID is not a valid ObjectId', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/123/tags`, { method: 'patch' }) // path id validation happens before body, that's why I'm not passing any body

      expect(status).toBe(400)
      expect(body.message).toBe('ID must be a valid ObjectId' )
    })
  })
})