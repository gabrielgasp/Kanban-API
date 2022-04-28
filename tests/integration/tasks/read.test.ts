import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database/mongodb'
import tasksSeed from '../../../src/database/mongodb/tasksSeed.json'
import { redis } from '../../../src/database/redis'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

// Here I replace the ioredis import with ioredis-mock library that runs in-memory just like mongodb-memory-server.
jest.mock('ioredis', () => require('ioredis-mock'))

describe('Tasks Read endpoint integration tests', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create() // Here we create the mongoDB instance in memory so we can test without using our database (and it's really fast)
    const uri = mongod.getUri() // Get the URI of the database we just created
    await mongoose.connect(uri) // Here we connect to the mongoDB instance in memory so our application can use it
  })

  beforeEach(async () => { // Here I clear the redis cache before each test. We will test cache in the last test.
    const redisKeys = await redis.keys('*')
    if (redisKeys.length) await redis.del(redisKeys)
  })

  afterAll(async () => {
    await mongoose.connection.close() // Here we close the connection to the mongoDB instance in memory
    await mongod.stop() // Here we stop the mongoDB instance in memory
    redis.disconnect() // Here we disconnect the redis client
  })

  describe('When there are no tasks in the collection', () => {
    it('Should 200 with docs property being an empty array and totalDocs property with value 0', async () => {
      const { status, body } = await fetchEndpoint(endpoint)

      expect(status).toBe(200)
      expect(body.totalDocs).toBe(0)
      expect(body.docsPerPage).toBe(10)
      expect(body.totalPages).toBe(1)
      expect(body.currentPage).toBe(1)
      expect(body.docs).toEqual([])
    })
  })

  describe('When there are tasks in the collection', () => {
    beforeAll(async () => {
      await taskModel.insertMany(tasksSeed)
    })

    describe('When fetching first page with a limit of 5', () => {
      it('Should 200 with docs containing 5 tasks ordered by boardId, status and priority and nextPage with value 2', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=1&limit=5')
  
        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(5)
        expect(body.docs[0]).toHaveProperty('_id')
        expect(body.docs[0].boardId).toBe(1)
        expect(body.docs[0].status).toBe('BACKLOG')
        expect(body.docs[0].priority).toBe(5)
        expect(body.docs[1]).toHaveProperty('_id')
        expect(body.docs[1].boardId).toBe(1)
        expect(body.docs[1].status).toBe('BACKLOG')
        expect(body.docs[1].priority).toBe(2)
        expect(body.docs[2]).toHaveProperty('_id')
        expect(body.docs[2].boardId).toBe(1)
        expect(body.docs[2].status).toBe('IN_PROGRESS')
        expect(body.docs[2].priority).toBe(3)
      })
    })

    describe('When fetching second page with limit of 5', () => {
      it('Should 200 with previousPage being 1 and nextPage being 3', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=2&limit=5')
        // console.log(body)
        // console.log(redis.keys('*'))
        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(2)
        expect(body.nextPage).toBe(3)
        expect(body.previousPage).toBe(1)
        expect(body.docs).toHaveLength(5)
      })
    })

    describe('When fetching last page with limit of 5', () => {
      it('Should 200 with previousPage being 5 and nextPage being undefined', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=6&limit=5')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(6)
        expect(body.nextPage).toBeUndefined()
        expect(body.previousPage).toBe(5)
        expect(body.docs).toHaveLength(3)
      })
    })

    describe('When fetching first page with a limit greater than number of documents in collection', () => {
      it('Should 200 with docs containing all documents and have no previous nor next page property', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=1&limit=30')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(30)
        expect(body.totalPages).toBe(1)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBeUndefined()
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(28)
      })
    })

    describe('When trying to fetch page zero', () => {
      it('Should 200 with response using page 1 as default', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=0&limit=5')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(5)
      })
    })

    describe('When trying to fetch with limit zero', () => {
      it('Should 200 with response using limit 10 as default', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=1&limit=0')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(10)
        expect(body.totalPages).toBe(3)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(10)
      })
    })

    describe('When trying to fetch with page negative', () => {
      it('Should 200 with response using page 1 as default', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=-1&limit=5')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(5)
      })
    })

    describe('When trying to fetch with limit negative', () => {
      it('Should 200 with response using limit 10 as default', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=1&limit=-1')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(10)
        expect(body.totalPages).toBe(3)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(10)
      })
    })

    describe('When trying to fetch with page that can not be parsed into a number', () => {
      it('Should 200 with response using page 1 as default', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=a&limit=5')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(5)
      })
    })

    describe('When trying to fetch with limit that can not be parsed into a number', () => {
      it('Should 200 with response using limit 10 as default', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=1&limit=a')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(10)
        expect(body.totalPages).toBe(3)
        expect(body.currentPage).toBe(1)
        expect(body.nextPage).toBe(2)
        expect(body.previousPage).toBeUndefined()
        expect(body.docs).toHaveLength(10)
      })
    })

    describe('When trying to fetch with page that is greater than total pages', () => {
      it('Should 200 with result from last possible page', async () => {
        const { status, body } = await fetchEndpoint(endpoint + '?page=7&limit=5')

        expect(status).toBe(200)
        expect(body.totalDocs).toBe(28)
        expect(body.docsPerPage).toBe(5)
        expect(body.totalPages).toBe(6)
        expect(body.currentPage).toBe(6)
        expect(body.nextPage).toBeUndefined()
        expect(body.previousPage).toBe(5)
        expect(body.docs).toHaveLength(3)
      })
    })

    describe('When an unexpected error occurs', () => {
      it('Should 500 with message', async () => {
        jest.spyOn(taskModel, 'paginate').mockRejectedValueOnce(new Error('Unexpected error') as never)
        const { status, body } = await fetchEndpoint(endpoint)
  
        expect(status).toBe(500)
        expect(body.message).toBe('Something went wrong here, please try again later')
      })
    })

    describe('When using redis to get cached data', () => {
      it('Should 200 with response from cache', async () => {
        const redisKey = `${taskModel.modelName}:1:5`

        expect(await redis.exists(redisKey)).toBe(0) // Check that there is no cache from other tests

        await fetchEndpoint(endpoint + '?page=1&limit=5') // First request to create a cache
        expect(await redis.exists(redisKey)).toBe(1) // Check if cache was created

        const cachedData = JSON.parse(await redis.get(redisKey) as string) // Get cached data from redis to compare
        expect(cachedData).not.toBeNull() // Check that cache was created

        const { status, body } = await fetchEndpoint(endpoint + '?page=1&limit=5') // Second request to get cached data

        expect(status).toBe(200)
        expect(body.docs).toEqual(cachedData.docs) // Make sure we are getting the same documents stored in redis
      })
    })
  })
})