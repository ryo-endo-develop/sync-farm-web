import {
  Action as AlertDialogAction,
  Cancel as AlertDialogCancel,
  Content as AlertDialogContent,
  Description as AlertDialogDescription,
  Overlay as AlertDialogOverlay,
  Portal as AlertDialogPortal,
  Root as AlertDialogRoot, // Root は React 本体と被る可能性があるのでエイリアス推奨
  Title as AlertDialogTitle
} from '@radix-ui/react-alert-dialog'
import * as Dialog from '@radix-ui/react-dialog'
import { X as CloseIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Task } from '../../generated/api'
import {
  CreateTaskFormData,
  CreateTaskInput,
  PutTaskInput
} from '../../schemas/taskSchema'
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation
} from '../../store/api/taskApi'
import * as dialogStyles from '../../styles/AlertDialog.css'
import * as modalStyles from '../../styles/Modal.css'
import { vars } from '../../styles/theme.css'
import { Button } from '../atoms/Button/Button'
import { TaskForm } from '../organisms/TaskForm/TaskForm'
import { TaskFormInitialValues } from '../organisms/TaskForm/TaskForm.types'
import { TaskList } from '../organisms/TaskList/TaskList'

const TaskListPage: React.FC = () => {
  // API フック
  // RTK Query フックを使ってタスク一覧を取得
  // pollingInterval を設定すると定期的に再取得 (例: 5分ごと)
  const {
    data: tasks,
    isLoading,
    isError,
    error,
    refetch
  } = useGetTasksQuery(undefined, {
    // pollingInterval: 300000, // 5分 = 300000ms
    // refetchOnMountOrArgChange: true, // マウント時や引数変更時に再取得 (デフォルトtrue)
  })
  const [addTask, { isLoading: isAddingTask }] = useAddTaskMutation()
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeletingTask }] = useDeleteTaskMutation()

  // --- State 管理 ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  // --- イベントハンドラー ---
  // 新規追加フォーム送信
  const handleAddFormSubmit = async (data: CreateTaskFormData) => {
    const submitData: CreateTaskInput = {
      // ★ CreateTaskInput に変換
      name: data.name,
      assigneeId: data.assigneeId === '' ? null : data.assigneeId,
      dueDate: data.dueDate === '' ? null : data.dueDate
    }
    try {
      await addTask(submitData).unwrap()
      setIsAddModalOpen(false)
    } catch (err) {
      console.error('タスク追加失敗:', err)
    }
  }

  // 編集ボタンクリック時の処理
  const handleEditClick = (taskId: string) => {
    setEditingTaskId(taskId) // 編集対象の ID をセット
    setIsEditModalOpen(true) // 編集モーダルを開く
  }

  // 編集フォーム送信時の処理
  const handleEditFormSubmit = async (data: CreateTaskFormData) => {
    if (!editingTaskId) return // editingTaskId がなければ何もしない

    // CreateTaskFormData を PutTaskInput 形式に変換
    const putData: PutTaskInput = {
      name: data.name,
      assigneeId: data.assigneeId === '' ? null : data.assigneeId,
      dueDate: data.dueDate === '' ? null : data.dueDate,
      // isCompleted は編集フォームに含まれていないため、現在の値を使う必要がある
      // もし TaskForm で isCompleted も編集できるようにする場合は、スキーマとフォームの修正が必要
      isCompleted:
        tasks?.find((t) => t.id === editingTaskId)?.isCompleted ?? false // 現在の値を取得
    }

    try {
      await updateTask({ taskId: editingTaskId, body: putData }).unwrap()
      console.log('タスク更新成功')
      setIsEditModalOpen(false) // 成功したらモーダルを閉じる
      setEditingTaskId(null) // 編集対象 ID をクリア
    } catch (err) {
      console.error('タスク更新失敗:', err)
      // TODO: エラー通知
    }
  }

  // ★ 削除ボタンクリック時の処理 (TaskListから渡される)
  const handleDeleteClick = (taskId: string) => {
    const task = tasks?.find((t) => t.id === taskId)
    if (task) {
      setTaskToDelete(task) // 削除対象情報をセット
      setIsAlertOpen(true) // 確認ダイアログを開く
    }
  }

  // ★ 確認ダイアログで「削除」が押されたときの処理
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return
    try {
      await deleteTask(taskToDelete.id).unwrap()
      console.log('タスク削除成功:', taskToDelete.id)
      // ダイアログは Radix により自動で閉じる (Action のデフォルト)
      setTaskToDelete(null) // 念のためクリア
    } catch (err) {
      console.error('タスク削除失敗:', err)
      // エラー時もダイアログは閉じて良いか、表示し続けるかは要件による
      // setTaskToDelete(null);
    }
  }

  // ★ 編集対象のタスクデータをメモ化して取得
  const editingTaskData = useMemo((): TaskFormInitialValues | undefined => {
    if (!editingTaskId || !tasks) return undefined
    const task = tasks.find((t) => t.id === editingTaskId)
    if (!task) return undefined
    // TaskForm の initialValues 形式に変換 (null を空文字に)
    return {
      name: task.name,
      assigneeId: task.assigneeId ?? '',
      dueDate: task.dueDate ?? ''
      // isCompleted は TaskForm の defaultValues にないので含めない
    }
  }, [editingTaskId, tasks])

  return (
    <div>
      <h1>タスク一覧</h1>

      {/* --- ボタン類 --- */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* 新規追加ボタン */}
        <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <Dialog.Trigger asChild>
            <Button variant="primary">+ 新規タスク</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={modalStyles.dialogOverlay} />
            <Dialog.Content className={modalStyles.dialogContent}>
              <Dialog.Title className={modalStyles.dialogTitle}>
                新しいタスクを作成
              </Dialog.Title>
              <TaskForm
                onSubmit={handleAddFormSubmit} // ★ 新規追加用 Submit ハンドラ
                onCancel={() => setIsAddModalOpen(false)}
                isLoading={isAddingTask}
              />
              <Dialog.Close asChild>{/* ... Close Button ... */}</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Button
          onClick={() => {
            void refetch()
          }}
          variant="secondary"
          disabled={isLoading}
        >
          手動更新
        </Button>
      </div>

      {/* --- タスクリスト --- */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* --- ★★★ 編集用モーダル ★★★ --- */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {/* Trigger は TaskItem 内のボタンが担当 */}
        <Dialog.Portal>
          <Dialog.Overlay className={modalStyles.dialogOverlay} />
          <Dialog.Content className={modalStyles.dialogContent}>
            <Dialog.Title className={modalStyles.dialogTitle}>
              タスクを編集
            </Dialog.Title>

            {/* TaskForm を編集モードでレンダリング */}
            {editingTaskData && ( // editingTaskData が取得できてから表示
              <TaskForm
                onSubmit={handleEditFormSubmit} // ★ 編集用 Submit ハンドラ
                onCancel={() => setIsEditModalOpen(false)}
                isLoading={isUpdatingTask} // ★ 更新中のローディング状態
                initialValues={editingTaskData} // ★ 初期値を渡す
                isEditing={true} // ★ 編集モードであることを伝える
              />
            )}

            <Dialog.Close asChild>
              <Button
                variant="text"
                size="sm"
                className={modalStyles.closeButton}
                aria-label="閉じる"
                style={{ padding: vars.space[1] }}
              >
                <CloseIcon size={20} />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialogRoot open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        {/* Trigger は TaskItem 内のボタンが担当 */}
        <AlertDialogPortal>
          <AlertDialogOverlay className={dialogStyles.alertDialogOverlay} />
          <AlertDialogContent className={dialogStyles.alertDialogContent}>
            <AlertDialogTitle className={dialogStyles.alertDialogTitle}>
              タスクの削除
            </AlertDialogTitle>
            <AlertDialogDescription
              className={dialogStyles.alertDialogDescription}
            >
              本当にタスク「{taskToDelete?.name}」を削除してもよろしいですか？
              <br />
              この操作は元に戻せません。
            </AlertDialogDescription>
            <div className={dialogStyles.alertDialogFooter}>
              <AlertDialogCancel asChild>
                <Button variant="text" disabled={isDeletingTask}>
                  キャンセル
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="danger"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleConfirmDelete} // async 関数を直接渡すので ESLint ルールを無効化
                  isLoading={isDeletingTask}
                  disabled={isDeletingTask}
                >
                  削除する
                </Button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialogRoot>
    </div>
  )
}

export default TaskListPage
