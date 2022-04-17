import { fetchEndpoint } from './__helpers__'

describe('Send a GET request to /docs to make sure endpoint is alive', () => {
  it('Should 200', async () => {
    const result = await fetchEndpoint('/docs')

    expect(result.status).not.toBe(404)
    expect(result.header['content-type']).toBe('text/html; charset=UTF-8')
  })
})
