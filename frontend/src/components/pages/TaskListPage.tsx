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
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger
} from '@radix-ui/react-popover'
import { CheckIcon, Filter, X as CloseIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Task } from '../../generated/api'
import {
  CreateTaskFormData,
  CreateTaskInputSchema,
  PutTaskInputSchema
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
import { Checkbox } from '../atoms/Checkbox/Checkbox'
import { Icon } from '../atoms/Icon/Icon'
import { Label } from '../atoms/Label/Label'
import { Select } from '../atoms/Select/Select'
import { SelectOption } from '../atoms/Select/Select.types'
import { Text } from '../atoms/Text/Text'
import { Pagination } from '../molecules/Pagenation/Pagenation'
import { RoutineTaskList } from '../organisms/RoutineTaskList/RoutineTaskList'
import * as multiSelectStyles from '../organisms/TaskForm/LabelMultiSelect.css'
import { TaskForm } from '../organisms/TaskForm/TaskForm'
import { TaskFormInitialValues } from '../organisms/TaskForm/TaskForm.types'
import { TaskList } from '../organisms/TaskList/TaskList'
import * as pageStyles from './TaskListPage.css'

type SortOptionValue = 'createdAt_desc' | 'dueDate_asc' | 'dueDate_desc'
const DEFAULT_LIMIT = 5

const AVAILABLE_LABELS = [
  '家事',
  '仕事',
  '買い物',
  '重要',
  '個人',
  '後でやる',
  '不明'
]

const TaskListPage: React.FC = () => {
  const [addTask, { isLoading: isAddingTask }] = useAddTaskMutation()
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeletingTask }] = useDeleteTaskMutation()

  // --- State 管理 ---
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(DEFAULT_LIMIT)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  // フィルターとソート
  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false)
  const [sortBy, setSortBy] = useState<SortOptionValue>('createdAt_desc')
  const [selectedFilterLabels, setSelectedFilterLabels] = useState<string[]>([])

  // --- API フック ---
  // RTK Query フックを使ってタスク一覧を取得
  // pollingInterval を設定すると定期的に再取得 (例: 5分ごと)
  const queryParams = useMemo(() => {
    const params = {
      // ★ デバッグしやすいように変数に格納
      assigneeId: showOnlyMyTasks ? 'me' : undefined,
      sort: sortBy,
      labels:
        selectedFilterLabels.length > 0
          ? selectedFilterLabels.join(',')
          : undefined,
      page: currentPage,
      limit: limit
    }
    return params
  }, [showOnlyMyTasks, sortBy, selectedFilterLabels, currentPage, limit])
  const {
    data: paginatedResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetTasksQuery(queryParams, {
    // pollingInterval: 300000, // 5分 = 300000ms
    // refetchOnMountOrArgChange: true, // マウント時や引数変更時に再取得 (デフォルトtrue)
  })

  const allTasks = paginatedResponse?.data
  const paginationMeta = paginatedResponse?.meta

  // ★★★ 取得したタスクを定常タスクと通常タスクに分類 ★★★
  const { todaysRoutines, regularTasks } = useMemo(() => {
    const routines: Task[] = []
    const regulars: Task[] = []
    if (allTasks) {
      allTasks.forEach((task) => {
        if (task.isRecurring) {
          // isRecurring フラグで判断
          routines.push(task)
        } else {
          regulars.push(task)
        }
      })
    }
    return { todaysRoutines: routines, regularTasks: regulars }
  }, [allTasks]) // allTasks が変化したら再計算

  // --- イベントハンドラー ---
  // フィルター/ソート変更時にページを1に戻す
  const handleFilterChange = (checked: boolean) => {
    setShowOnlyMyTasks(checked)
    setCurrentPage(1) // ページをリセット
  }
  const handleSortChange = (value: SortOptionValue) => {
    setSortBy(value)
    setCurrentPage(1) // ページをリセット
  }
  const handleLabelFilterChange = (label: string, checked: boolean) => {
    setSelectedFilterLabels((prevLabels) => {
      const newLabels = checked
        ? [...prevLabels, label] // チェックされたら追加
        : prevLabels.filter((l) => l !== label) // 外れたら削除
      setCurrentPage(1) // ページをリセット
      return newLabels
    })
    void refetch()
  }

  // ページネーションハンドラー
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // ページトップにスクロールするなどの処理を追加しても良い
    // window.scrollTo(0, 0);
  }

  // 新規追加フォーム送信
  const handleAddFormSubmit = async (data: CreateTaskFormData) => {
    try {
      const submitData = CreateTaskInputSchema.parse(data)
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

    const currentTask = allTasks?.find((t) => t.id === editingTaskId)
    if (!currentTask) return // 対象タスクが見つからない場合

    try {
      const putData = PutTaskInputSchema.parse({
        ...data,
        isCompleted: currentTask.isCompleted // フォームにないので現在の値を使う
      })
      await updateTask({ taskId: editingTaskId, body: putData }).unwrap()
      console.log('タスク更新成功')
      setIsEditModalOpen(false) // 成功したらモーダルを閉じる
      setEditingTaskId(null) // 編集対象 ID をクリア
    } catch (err) {
      console.error('タスク更新失敗:', err)
      // TODO: エラー通知
    }
  }

  // 削除ボタンクリック時の処理 (TaskListから渡される)
  const handleDeleteClick = (taskId: string) => {
    const task = allTasks?.find((t) => t.id === taskId)
    if (task) {
      setTaskToDelete(task) // 削除対象情報をセット
      setIsAlertOpen(true) // 確認ダイアログを開く
    }
  }

  // 確認ダイアログで「削除」が押されたときの処理
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

  // 編集対象のタスクデータをメモ化して取得
  const editingTaskData = useMemo((): TaskFormInitialValues | undefined => {
    if (!editingTaskId || !allTasks) return undefined
    const task = allTasks.find((t) => t.id === editingTaskId)
    if (!task) return undefined
    // TaskForm の initialValues 形式に変換
    return {
      name: task.name,
      assigneeId: task.assigneeId ?? '',
      dueDate: task.dueDate ?? '',
      // ★ labels 配列をカンマ区切り文字列に変換
      labels: Array.isArray(task.labels) ? task.labels : []
    }
  }, [editingTaskId, allTasks])

  const sortOptions: SelectOption[] = [
    { value: 'createdAt_desc', label: '作成日 (新しい順)' },
    { value: 'dueDate_asc', label: '期限日 (昇順)' },
    { value: 'dueDate_desc', label: '期限日 (降順)' }
  ]

  const isLoadingOrFetching = isLoading || isFetching

  return (
    <div>
      <h1>タスク一覧</h1>

      {/* --- ★★★ 区切り線 ★★★ --- */}
      <hr className={pageStyles.separator} />

      {/* --- ★★★ 今日のルーティン セクション ★★★ --- */}
      <section>
        <h2 className={pageStyles.sectionTitle}>今日のルーティン</h2>
        {/* ローディング中も表示しないか、専用スケルトンを用意 */}
        {!isLoadingOrFetching && <RoutineTaskList tasks={todaysRoutines} />}
        {/* 初回ローディング中のみスケルトン表示する例 */}
        {isLoading && !isFetching && <p>ルーティン読み込み中...</p>}
        {/* エラー表示 */}
        {isError && !isLoading && (
          <p style={{ color: vars.color.error }}>ルーティン読込エラー</p>
        )}
      </section>

      {/* --- ★★★ 区切り線 ★★★ --- */}
      <hr className={pageStyles.separator} />

      {/* --- ★★★ 通常のタスク セクション ★★★ --- */}
      <section>
        <h2 className={pageStyles.sectionTitle}>
          {showOnlyMyTasks ? '自分のタスク' : '通常のタスク'}
        </h2>

        {/* --- ボタン類 --- */}
        <div className={pageStyles.topButtonArea}>
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
                <Dialog.Close asChild>
                  {/* ... Close Button ... */}
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* --- フィルターとソートコントロール --- */}
        <div className={pageStyles.controlsContainer}>
          {/* 左側フィルター群 */}
          <div className={pageStyles.filterGroup}>
            {/* 自分のタスク */}
            <Checkbox
              id="filter-my-tasks"
              checked={showOnlyMyTasks}
              onChange={(e) => handleFilterChange(e.target.checked)}
              label="自分のタスクのみ表示"
              disabled={isLoadingOrFetching}
            />

            {/* ラベル */}
            <PopoverRoot>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Icon as={Filter} size="1em" />}
                  disabled={isLoadingOrFetching}
                >
                  ラベルで絞り込み{' '}
                  {selectedFilterLabels.length > 0 &&
                    `(${selectedFilterLabels.length})`}
                </Button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent
                  className={multiSelectStyles.popoverContent} // TaskForm のスタイルを流用
                  sideOffset={5}
                  align="start"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    style={{
                      padding: `${vars.space[1]} ${vars.space[3]}`,
                      color: vars.color.textSecondary
                    }}
                  >
                    ラベルで絞り込む
                  </Text>
                  {AVAILABLE_LABELS.map((labelOption) => (
                    <div
                      key={labelOption}
                      className={multiSelectStyles.checkboxItem}
                    >
                      <CheckboxPrimitive.Root
                        id={`filter-label-${labelOption}`}
                        checked={selectedFilterLabels.includes(labelOption)}
                        onCheckedChange={(checked) => {
                          // checked が boolean | 'indeterminate' なので型ガード
                          if (typeof checked === 'boolean') {
                            handleLabelFilterChange(labelOption, checked)
                          }
                        }}
                        className={multiSelectStyles.checkboxRoot}
                      >
                        <CheckboxPrimitive.Indicator
                          className={multiSelectStyles.checkboxIndicator}
                        >
                          <CheckIcon size={12} strokeWidth={3} />
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>
                      <Label
                        htmlFor={`filter-label-${labelOption}`}
                        className={multiSelectStyles.checkboxLabel}
                      >
                        {labelOption}
                      </Label>
                    </div>
                  ))}
                </PopoverContent>
              </PopoverPortal>
            </PopoverRoot>
          </div>

          {/* 右側ソート群 */}
          <div className={pageStyles.sortGroup}>
            <Label htmlFor="sort-tasks" className={pageStyles.sortLabel}>
              並び順:
            </Label>
            <Select
              id="sort-tasks"
              options={sortOptions}
              value={sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as SortOptionValue)
              }
              className={pageStyles.sortSelect}
              disabled={isLoadingOrFetching}
            />
          </div>
        </div>

        <TaskList
          tasks={regularTasks} // ★ 通常タスクのみを渡す
          isLoading={isLoadingOrFetching} // ローディング状態
          isError={isError}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </section>

      {/* --- ページネーション UI --- */}
      {paginationMeta && (
        <Pagination
          currentPage={paginationMeta.currentPage}
          totalPages={paginationMeta.totalPages}
          totalItems={paginationMeta.totalItems}
          onPageChange={handlePageChange}
          isLoading={isLoadingOrFetching}
        />
      )}

      {/* --- 編集用モーダル --- */}
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

      {/* --- 削除用モーダル --- */}
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
