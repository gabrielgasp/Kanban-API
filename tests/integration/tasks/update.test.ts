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
  members: ['test'],
  tags: ['test']
}

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
  })

  describe('When operation fails', () => {
    it('Should 400 with message and provided ID is not a valid ObjectId', async () => {
      const { status, body } = await fetchEndpoint(`${endpoint}/123`, { method: 'patch' }) // path id validation happens before body, that's why I'm not passing any body

      expect(status).toBe(400)
      expect(body.message).toBe('ID must be a valid ObjectId' )
    })
  })
})