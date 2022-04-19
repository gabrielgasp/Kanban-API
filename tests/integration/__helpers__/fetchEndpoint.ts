import { app } from '../../../src/app'
import request from 'supertest'

interface IConfig {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
  body?: any
  token?: string
}

export const fetchEndpoint = async (endpoint: string, config: IConfig = {}) => {
  const method = config.method ?? 'get'
  const body = config.body ?? {}
  const token = config.token ?? ''

  return request(app)[method](endpoint).set('Authorization', token).send(body)
}