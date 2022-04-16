import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

const newTasks = [
  {
    boardId: 2,
    status: 'todo',
    title: 'task that I need to do',
    priority: 1,
  },
  {
    boardId: 1,
    status: 'in_progress',
    title: 'task that I am doing',
    priority: 2,
  },
  {
    boardId: 1,
    status: 'in_progress',
    title: 'task that I am also doing but is more important',
    priority: 5,
  },
  {
    boardId: 1,
    status: 'done',
    title: 'task that I have done',
    priority: 3,
  },
]

describe('Tasks Read endpoint integration tests', () => {
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

  describe('When there are no tasks in the collection', () => {
    it('Should 200 with an empty array', async () => {
      const { status, body } = await fetchEndpoint(endpoint)

      expect(status).toBe(200)
      expect(body).toEqual([])
    })
  })

  describe('When there are tasks in the collection', () => {
    beforeAll(async () => {
      await taskModel.insertMany(newTasks)
    })

    it('Should 200 with all tasks ordered by boardId and status', async () => {
      const { status, body } = await fetchEndpoint(endpoint)

      expect(status).toBe(200)
      expect(body[0]).toHaveProperty('_id')
      expect(body[0]).toMatchObject(newTasks[3])
      expect(body[1]).toHaveProperty('_id')
      expect(body[1]).toMatchObject(newTasks[2])
      expect(body[2]).toHaveProperty('_id')
      expect(body[2]).toMatchObject(newTasks[1])
      expect(body[3]).toHaveProperty('_id')
      expect(body[3]).toMatchObject(newTasks[0])
    })
  })
})