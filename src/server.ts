import 'dotenv/config'
import { connectToMongoDB } from './database/mongodb'
import { app } from './app'

const PORT = process.env.PORT ?? 3001

const start = async (): Promise<void> => {
  await connectToMongoDB()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

void start()
