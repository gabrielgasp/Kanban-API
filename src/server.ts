import { connectToMongoDB } from './database/mongodb'
import { redis } from './database/redis'
import { app } from './app'

const PORT = process.env.PORT ?? 3001

const start = async (): Promise<void> => {
  await connectToMongoDB()

  redis.on('connect', () => { // If redis is connected, then start the server
    console.log('Redis connection established')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })

  redis.on('error', () => { // If the connection fails, we exit the process.
    console.error('Redis connection failed')
    process.exit(1)
  })
}

void start()
