import React from 'react'

import { useGetTasksQuery } from '../../store/api/taskApi' // 自動生成されたフックをインポート
import { TaskList } from '../organisms/TaskList' // 作成したOrganismをインポート
// import { Button } from '../components/atoms/Button'; // 後で追加・削除ボタン用に

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

  // TODO: タスク追加・更新・削除の mutation フックも後で使用する
  // const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  // const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  // const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  return (
    <div>
      <h1>タスク一覧</h1>

      {/* TODO: タスク追加ボタンなどを配置 */}
      {/* <Button onClick={() => {}}>+ 新規タスク</Button> */}

      {/* TaskList Organism に取得結果を渡す */}
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
