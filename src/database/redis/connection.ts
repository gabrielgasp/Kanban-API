import Redis from 'ioredis'

export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL) // For heroku
  : new Redis({ host: process.env.REDIS_HOST }) // For localhost (default) or docker-compose
