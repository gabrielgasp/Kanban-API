import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

const newTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
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
  })

  describe('When operation is successful', () => {
    let createdTaskId: string
    it('Should 201 with created task data', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: newTask })

      expect(status).toBe(201)
      expect(body).toMatchObject(newTask)
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      createdTaskId = body._id // We save the id of the created task so we can use it in the next test
    })

    it('Task should exist in the database', async () => {
      const task = await taskModel.findById(createdTaskId)

      expect(task).toMatchObject(newTask)
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
  })
})