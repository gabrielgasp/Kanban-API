import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks/board'

const tasks = [
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

describe('Tasks readFromBoard endpoint integration tests', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create() // Here we create the mongoDB instance in memory so we can test without using our database (and it's really fast)
    const uri = mongod.getUri() // Get the URI of the database we just created
    await mongoose.connect(uri) // Here we connect to the mongoDB instance in memory so our application can use it
    await taskModel.insertMany(tasks)
  })
  
  afterAll(async () => {
    await mongoose.connection.close() // Here we close the connection to the mongoDB instance in memory
    await mongod.stop() // Here we stop the mongoDB instance in memory
  })

  describe('When there are tasks in the collection for the boardId provided', () => {
    it('Should 200 with all tasks ordered by and status and priority', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/1`)

      expect(status).toBe(200)
      expect(body[0]).toHaveProperty('_id')
      expect(body[0]).toMatchObject(tasks[2])
      expect(body[1]).toHaveProperty('_id')
      expect(body[1]).toMatchObject(tasks[1])
      expect(body[2]).toHaveProperty('_id')
      expect(body[2]).toMatchObject(tasks[0])
    })
  })

  describe('When there are no tasks in the collection for the boardId provided', () => {
    it('Should 404 with message', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/2`)

      expect(status).toBe(404)
      expect(body.message).toBe('No tasks were found for the boardId provided, please make sure that the board exist and have tasks')
    })
  })

  describe('When an unexpected error occurs', () => {
    it('Should 500 with message', async () => {
      vi.spyOn(taskModel, 'find').mockResolvedValueOnce({
        sort: vi.fn().mockRejectedValueOnce(new Error('Unexpected error'))
      } as never)

      const { status, body } = await fetchEndpoint(`${endpoint}/1`)

      expect(status).toBe(500)
      expect(body.message).toBe('Something went wrong here, please try again later')
    })
  })
})