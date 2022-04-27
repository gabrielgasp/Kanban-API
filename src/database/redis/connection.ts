import Redis from 'ioredis'

export const redis = new Redis() // Here we instantiate the redis client and export in a singleton pattern.

redis.on('connect', () => {
  console.log('Redis connection established')
})

redis.on('error', () => { // If the connection fails, we exit the process.
  console.error('Redis connection failed')
  process.exit(1)
})
