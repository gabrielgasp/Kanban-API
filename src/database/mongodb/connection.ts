import mongoose from 'mongoose'
import { taskModel } from './models'
import tasksSeed from './tasksSeed.json'

export const connectToMongoDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/mamboo-kanban-api'
    await mongoose.connect(mongoURI)
    console.log('MongoDB connection established')
    // If the tasks collection is empty it will be seeded with mock data during the first connection.
    if (await taskModel.countDocuments() === 0) {
      await taskModel.insertMany(tasksSeed)
      console.log('MongoDB seeded with 28 random tasks')
    }
  } catch (e) {
    console.error('MongoDB connection failed')
    process.exit(1)
  }
}
