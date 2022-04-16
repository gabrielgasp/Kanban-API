export interface ITask {
  boardId: number // This would probably be changed to string if we are using ObjectIds
  status: string
  title: string
  description: string
  priority: number
  members: string[]
  tags: string[]
}
