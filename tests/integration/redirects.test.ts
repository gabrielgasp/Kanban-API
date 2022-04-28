import { fetchEndpoint } from './__helpers__'

jest.mock('ioredis', () => require('ioredis-mock')) // Necessary so that we can run this tests without a redis server running.

describe('Redirects tests', () => {
  it('Should 302 with redirect to "/docs/pt" when trying to acess "/"', async () => {
    const { status, header } = await fetchEndpoint('/')

    expect(status).toBe(302)
    expect(header.location).toBe('/docs/pt')
  })

  it('Should 302 with redirect to "/docs/pt" when trying to acess "/docs"', async () => {
    const { status, header } = await fetchEndpoint('/docs')

    expect(status).toBe(302)
    expect(header.location).toBe('/docs/pt')
  })
})
