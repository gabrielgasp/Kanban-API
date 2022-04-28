import { fetchEndpoint } from './__helpers__'

jest.mock('ioredis', () => require('ioredis-mock')) // Necessary so that we can run this tests without a redis server running.

describe('Send a GET request to /healthcheck to make sure API is running', () => {
  
  it('Should 200 with text "API OK"', async () => {
    const result = await fetchEndpoint('/healthcheck')

    expect(result.status).toBe(200)
    expect(result.text).toBe('API HEALTHY')
  })
})
