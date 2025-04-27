import {
  Action as AlertDialogAction,
  Cancel as AlertDialogCancel,
  Content as AlertDialogContent,
  Description as AlertDialogDescription,
  Overlay as AlertDialogOverlay,
  Portal as AlertDialogPortal,
  Root as AlertDialogRoot,
  Title as AlertDialogTitle} from '@radix-ui/react-alert-dialog'
import React, { useState } from 'react'

import { PutTaskInput, Task } from '../../../generated/api'
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from '../../../store/api/taskApi'
import * as dialogStyles from '../../../styles/AlertDialog.css'
import { Button } from '../../atoms/Button/Button'
import { TaskItem } from '../../molecules/TaskItem/TaskItem'
import * as styles from './TaskList.css'

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
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()

  // ★ AlertDialog の開閉状態と削除対象タスクIDを管理する State
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

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

  const handleDeleteClick = (taskId: string) => {
    const task = tasks?.find((t) => t.id === taskId)
    if (task) {
      setTaskToDelete(task) // 削除対象のタスク情報を State に保存
      setIsAlertOpen(true) // ダイアログを開く
    }
  }

  // ★ AlertDialog で「削除」が押されたときの処理
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return

    try {
      await deleteTask(taskToDelete.id).unwrap()
      console.log('タスク削除成功:', taskToDelete.id)
      // 成功したらダイアログは自動で閉じる (AlertDialog.Action のデフォルト挙動)
      // setTaskToDelete(null); // State をクリア (任意)
    } catch (err) {
      console.error('タスク削除失敗:', err)
      // TODO: ユーザーへのエラー通知 (ダイアログ内やトーストなど)
      // エラー時はダイアログを閉じない方が良い場合も
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
    <>
      {' '}
      {/* ★ Fragment を使う (リストとダイアログを並列に置くため) */}
      <ul className={styles.list}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteClick} // ★ ダイアログを開く関数を渡す
          />
        ))}
      </ul>
      {/* ★★★ 削除確認 AlertDialog ★★★ */}
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
                <Button variant="text" disabled={isDeleting}>
                  キャンセル
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="danger"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleConfirmDelete} // async 関数を直接渡すので ESLint ルールを無効化
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  削除する
                </Button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialogRoot>
    </>
  )
}
