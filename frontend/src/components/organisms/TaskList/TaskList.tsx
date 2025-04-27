import React from 'react'

import { PutTaskInput, Task } from '../../../generated/api'
import { useUpdateTaskMutation } from '../../../store/api/taskApi'
import { TaskItem } from '../../molecules/TaskItem/TaskItem'
import * as styles from './TaskList.css'

interface TaskListProps {
  tasks: Task[] | undefined
  isLoading: boolean
  isError: boolean
  error?: unknown
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  isError,
  error,
  onEdit,
  onDelete
}) => {
  const [updateTask] = useUpdateTaskMutation()

  // ★ TaskItem のチェックボックスが変更されたときのハンドラー
  const handleToggleCompleteAsync = async (
    taskId: string,
    isCompleted: boolean
  ) => {
    const task = tasks?.find((t) => t.id === taskId)
    if (!task) return

    const updatedBody: PutTaskInput = {
      name: task.name,
      assigneeId: task.assigneeId ?? null, // ?? null で undefined を null に変換
      dueDate: task.dueDate ?? null, // ?? null で undefined を null に変換
      isCompleted: isCompleted
    }

    try {
      console.log('Updating task:', taskId, updatedBody)
      await updateTask({ taskId, body: updatedBody }).unwrap()
      // キャッシュ無効化によりリストは自動更新されるはず
    } catch (err) {
      console.error('Failed to update task completion status:', err)
      // TODO: ユーザーへのエラー通知
    }
  }

  const handleToggleComplete = (taskId: string, isCompleted: boolean) => {
    handleToggleCompleteAsync(taskId, isCompleted).catch((err) => {
      // 必要であれば、ここでもエラーハンドリングを追加
      console.error('Unexpected error during toggle complete:', err)
    })
  }

  if (isLoading) {
    // ローディング中の表示 (将来的には Spinner Atom を使う)
    return <div className={styles.loading}>読み込み中...</div>
  }

  if (isError) {
    // エラー発生時の表示
    console.error('Failed to load tasks:', error) // コンソールにエラー詳細出力
    return <div className={styles.error}>タスクの読み込みに失敗しました。</div>
  }

  if (!tasks || tasks.length === 0) {
    // タスクが存在しない場合の表示
    return <div className={styles.empty}>表示できるタスクはありません。</div>
  }

  // タスク一覧の表示
  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete} // 完了トグルは内部処理
          onDelete={onDelete} // ★ 親から渡された onDelete をそのまま渡す
          onEdit={onEdit} // ★ 親から渡された onEdit をそのまま渡す
        />
      ))}
    </ul>
  )
}
