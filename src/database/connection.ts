import mongoose from 'mongoose'
import tasksSeed from './tasksSeed.json'

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/mamboo-kanban-api'
    await mongoose.connect(mongoURI)
    console.log('Database connection established')
    const db = mongoose.connection
    if (await db.collection('tasks').countDocuments() === 0) {
      await db.collection('tasks').insertMany(tasksSeed)
      console.log('Database seeded')
    }
  } catch (e) {
    console.error('Database connection failed')
    process.exit(1)
  }
}
