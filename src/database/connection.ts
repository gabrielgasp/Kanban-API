import mongoose from 'mongoose'

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/mamboo-kanban-api'
    await mongoose.connect(mongoURI)
    console.log('Database connection established')
  } catch (e) {
    console.error('Database connection failed')
    process.exit(1)
  }
}
