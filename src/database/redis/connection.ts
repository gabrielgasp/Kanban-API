import Redis from 'ioredis'

export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL) // For heroku
  : new Redis({ host: process.env.REDIS_HOST }) // For localhost (default) or docker-compose

redis.on('ready', () => {
  console.log('Redis connection established')
})

redis.on('error', () => { // If the connection fails, we exit the process.
  console.error('Redis connection failed')
  process.exit(1)
})
