import React from 'react'

import { CreateTaskInput, PutTaskInput } from '../../generated/api'
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation
} from '../../store/api/taskApi'
import { Button } from '../atoms/Button/Button'
import { TaskList } from '../organisms/TaskList/TaskList'

const TaskListPage: React.FC = () => {
  // RTK Query フックを使ってタスク一覧を取得
  // pollingInterval を設定すると定期的に再取得 (例: 5分ごと)
  const {
    data: tasks,
    isLoading,
    isError,
    error
  } = useGetTasksQuery(undefined, {
    // pollingInterval: 300000, // 5分 = 300000ms
    // refetchOnMountOrArgChange: true, // マウント時や引数変更時に再取得 (デフォルトtrue)
  })
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()

  const handleAddTaskAsync = async () => {
    const newTask: CreateTaskInput = {
      name: `新しいタスク ${new Date().toLocaleTimeString('ja-JP')}` // 現在時刻を入れて区別
      // assigneeId: null, // 省略可能
      // dueDate: null,    // 省略可能
    }
    try {
      // addTask Mutation を実行
      await addTask(newTask).unwrap() // unwrap() で成功時データ or エラー取得
      console.log('タスク追加成功')
      // キャッシュ無効化 (invalidatesTags) により、getTasks が再実行されるはず
      // 必要なら明示的に再取得: refetch();
    } catch (err) {
      console.error('タスク追加失敗:', err)
    }
  }

  const handleUpdateFirstTaskAsync = async () => {
    if (!tasks || tasks.length === 0) return // タスクがない場合は何もしない
    const firstTask = tasks[0]
    const updatedBody: PutTaskInput = {
      name: `${firstTask.name} (更新済)`, // 名前を更新
      // PUT なので他のフィールドも送る (現在の値をベースにする)
      assigneeId: firstTask.assigneeId,
      dueDate: firstTask.dueDate,
      isCompleted: !firstTask.isCompleted // 完了状態を反転させる例
    }
    try {
      await updateTask({ taskId: firstTask.id, body: updatedBody }).unwrap()
      console.log('タスク更新成功:', firstTask.id)
    } catch (err) {
      console.error('タスク更新失敗:', err)
    }
  }

  const handleDeleteFirstTaskAsync = async () => {
    if (!tasks || tasks.length === 0) return
    const firstTask = tasks[0]
    try {
      await deleteTask(firstTask.id).unwrap()
      console.log('タスク削除成功:', firstTask.id)
    } catch (err) {
      console.error('タスク削除失敗:', err)
    }
  }

  // --- onClick に渡すラッパー関数 (非 async) ---
  const handleClickAddTask = () => {
    // 非同期関数を呼び出す (戻り値の Promise は無視される)
    // エラーは async 関数内で catch しているので、ここでは catch 不要でも良い
    handleAddTaskAsync().catch((err) =>
      console.error('Unexpected error in Add Task:', err)
    )
  }

  const handleClickUpdateTask = () => {
    handleUpdateFirstTaskAsync().catch((err) =>
      console.error('Unexpected error in Update Task:', err)
    )
  }

  const handleClickDeleteTask = () => {
    handleDeleteFirstTaskAsync().catch((err) =>
      console.error('Unexpected error in Delete Task:', err)
    )
  }

  return (
    <div>
      <h1>タスク一覧</h1>

      {/* --- 一時的な操作ボタン --- */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Button
          onClick={handleClickAddTask}
          isLoading={isAdding}
          disabled={isAdding}
        >
          + ダミータスク追加
        </Button>
        <Button
          onClick={handleClickUpdateTask}
          isLoading={isUpdating}
          disabled={isUpdating || !tasks || tasks.length === 0}
          variant="outline"
        >
          最初のタスク更新(PUT)
        </Button>
        <Button
          onClick={handleClickDeleteTask}
          isLoading={isDeleting}
          disabled={isDeleting || !tasks || tasks.length === 0}
          variant="danger"
        >
          最初のタスク削除
        </Button>
      </div>
      {/* --- ここまで一時的な操作ボタン --- */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  )
}

export default TaskListPage
