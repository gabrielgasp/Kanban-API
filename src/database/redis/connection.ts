import Redis from 'ioredis'

const redisOptions = process.env.REDIS_URL
  ? { path: process.env.REDIS_URL } // used for heroku
  : { host: process.env.REDIS_HOST } // used for docker-compose or defaults to 'localhost' if no env var is set.

export const redis = new Redis(redisOptions)

redis.on('connect', () => {
  console.log('Redis connection established')
})

redis.on('error', () => { // If the connection fails, we exit the process.
  console.error('Redis connection failed')
  process.exit(1)
})
