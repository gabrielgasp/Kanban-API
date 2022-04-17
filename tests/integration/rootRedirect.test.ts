import { fetchEndpoint } from './__helpers__'

describe('GET to "/"', () => {
  it('Should 302 with redirect to "/tasks"', async () => {
    const { status, header } = await fetchEndpoint('/')

    expect(status).toBe(302)
    expect(header.location).toBe('/docs')
  })
})
