import { Document, Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { ITask } from '../../../ts/interfaces'

interface TaskDocument extends ITask, Document {}

const taskSchema = new Schema<TaskDocument>({
  boardId: { type: Number, required: true }, // This type would probably be changed to ObjectId if we have a "boards" collection
  status: { type: String, required: true }, // This represents the column ex: "BACKLOG" | "IN_PROGRESS" | "DONE", etc.
  title: { type: String, required: true },
  description: String,
  priority: { type: Number, required: true, min: 1, max: 5 },
  members: [String], // This type would probably be changed to ObjectId if we have a "users" collection
  tags: [String]
}, {
  timestamps: true,
  versionKey: false
})

taskSchema.plugin(paginate)

export const taskModel = model<TaskDocument, PaginateModel<TaskDocument>>('Task', taskSchema, 'tasks')
