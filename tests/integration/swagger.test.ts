import { fetchEndpoint } from './__helpers__'

jest.mock('ioredis', () => require('ioredis-mock')) // Necessary so that we can run this tests without a redis server running.

describe('Send a GET request to /docs endpoints to make sure they are alive', () => {
  it('Should 200 with /docs/pt', async () => {
    const result = await fetchEndpoint('/docs/pt')

    expect(result.status).not.toBe(404)
    expect(result.header['content-type']).toBe('text/html; charset=UTF-8')
  })

  it('Should 200 with /docs/en', async () => {
    const result = await fetchEndpoint('/docs/en')

    expect(result.status).not.toBe(404)
    expect(result.header['content-type']).toBe('text/html; charset=UTF-8')
  })
})
