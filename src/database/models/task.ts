import mongoose from 'mongoose'
import { ITask } from '../../ts/interfaces'

const taskSchema = new mongoose.Schema<ITask>({
  boardId: { type: Number, required: true }, // This type would probably be changed to ObjectId if we have a "boards" collection
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  members: { type: [String], required: true }, // This type would probably be changed to ObjectId if we have a "users" collection
  tags: { type: [String], required: true } // This type would probably be changed to ObjectId if we have a "tags" collection
}, {
  timestamps: true,
  collection: 'tasks',
  versionKey: false
})

export const taskModel = mongoose.model<ITask>('Task', taskSchema)
