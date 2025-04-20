import * as Dialog from '@radix-ui/react-dialog'
import { X as CloseIcon } from 'lucide-react'
import React, { useState } from 'react'

import { CreateTaskFormData } from '../../schemas/taskSchema'
import { useAddTaskMutation, useGetTasksQuery } from '../../store/api/taskApi'
import * as modalStyles from '../../styles/Modal.css'
import { vars } from '../../styles/theme.css'
import { Button } from '../atoms/Button/Button'
import { TaskForm } from '../organisms/TaskForm/TaskForm'
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
  const [addTask, { isLoading: isAddingTask }] = useAddTaskMutation()

  // ★ モーダルの開閉状態を管理する State
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ★ TaskForm が送信されたときの処理
  const handleFormSubmit = async (data: CreateTaskFormData) => {
    try {
      // CreateTaskFormData を CreateTaskInput に合わせる (今回はほぼ同じはず)
      // 必要ならここで変換処理を入れる
      await addTask(data).unwrap()
      console.log('タスク追加成功')
      setIsModalOpen(false) // 成功したらモーダルを閉じる
      // キャッシュ無効化によりリストは自動更新される
    } catch (err) {
      console.error('タスク追加失敗:', err)
      // TODO: ユーザーへのエラー通知 (フォーム内に表示するなど)
      // エラーでもモーダルを閉じない方が良い場合もある
    }
  }

  return (
    <div>
      <h1>タスク一覧</h1>

      {/* --- 一時的な操作ボタン --- */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* --- 新規追加ボタン (モーダル表示トリガー) --- */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <Button variant="primary">+ 新規タスク</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={modalStyles.dialogOverlay} />
            <Dialog.Content className={modalStyles.dialogContent}>
              <Dialog.Title className={modalStyles.dialogTitle}>
                新しいタスクを作成
              </Dialog.Title>
              {/* <Dialog.Description className={modalStyles.dialogDescription}>
                タスクの詳細を入力してください。
              </Dialog.Description> */}

              {/* TaskForm をレンダリング */}
              <TaskForm
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)} // キャンセルでモーダルを閉じる
                isLoading={isAddingTask} // 追加処理中のローディング状態を渡す
              />

              <Dialog.Close asChild>
                <Button
                  variant="text"
                  size="sm"
                  className={modalStyles.closeButton}
                  aria-label="閉じる"
                  style={{ padding: vars.space[1] }} // アイコンボタンのpadding調整例
                >
                  <CloseIcon size={20} />
                </Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

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
