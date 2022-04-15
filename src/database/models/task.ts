import mongoose from 'mongoose'
import { ITask } from '../../ts/interfaces'

interface TaskDocument extends ITask, mongoose.Document {}

const taskSchema = new mongoose.Schema<TaskDocument>({
  boardId: { type: Number, required: true }, // This type would probably be changed to ObjectId if we have a "boards" collection
  status: { type: String, required: true }, // This represents the column ex: "BACKLOG" | "IN_PROGRESS" | "DONE", etc.
  title: { type: String, required: true },
  description: String,
  members: [String], // This type would probably be changed to ObjectId if we have a "users" collection
  tags: [String] // This type would probably be changed to ObjectId if we have a "tags" collection
}, {
  timestamps: true,
  collection: 'tasks',
  versionKey: false
})

export const taskModel = mongoose.model('Task', taskSchema)
