import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

const task = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
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
  })

  describe('When operation is successful', () => {
    let taskId: string

    beforeAll(async () => {
      const { _id } = await taskModel.create(task)
      taskId = _id
    })

    it('Should 200 with deleted task data', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/${taskId}`, { method: 'delete' })

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

})