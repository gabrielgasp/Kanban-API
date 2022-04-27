import { connectToDatabase } from './database/mongodb'
import { app } from './app'

const PORT = process.env.PORT ?? 3001

const start = async (): Promise<void> => {
  await connectToDatabase()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

void start()
