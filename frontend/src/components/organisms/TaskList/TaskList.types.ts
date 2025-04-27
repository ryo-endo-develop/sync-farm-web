import type { Task } from '../../../generated/api' // Task 型をインポート

export interface TaskListProps {
  tasks: Task[] | undefined
  isLoading: boolean
  isError: boolean
  error?: unknown
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
}
