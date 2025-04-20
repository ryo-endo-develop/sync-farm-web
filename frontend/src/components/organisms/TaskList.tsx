import React from 'react'

import * as styles from './TaskList.css' // スタイルをインポート (任意)
import { Task } from '../../generated/api'
import { useUpdateTaskMutation } from '../../store/api/taskApi'
import { TaskItem } from '../molecules/TaskItem/TaskItem'

interface TaskListProps {
  tasks: Task[] | undefined
  isLoading: boolean
  isError: boolean
  error?: any
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  isError,
  error
}) => {
  const [updateTask] = useUpdateTaskMutation()

  // ★ TaskItem のチェックボックスが変更されたときのハンドラー
  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    const task = tasks?.find((t) => t.id === taskId)
    if (!task) return

    // PUT なので他のフィールドも必要 (現在の値をそのまま使う)
    const updatedBody = {
      name: task.name,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      isCompleted: isCompleted // 変更後の完了状態
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

  // タスク一覧の表示 (今は簡単なリスト)
  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        // ★ TaskItem コンポーネントを使用
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete} // ★ ハンドラーを渡す
        />
      ))}
    </ul>
  )
}
