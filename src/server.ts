import { connectToDatabase } from './database'

const start = async (): Promise<void> => {
  await connectToDatabase()
}

void start()
