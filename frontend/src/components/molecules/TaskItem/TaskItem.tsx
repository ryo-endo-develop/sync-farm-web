import { CalendarDays, Pencil, Trash } from 'lucide-react' // アイコン例
import React from 'react'

import { vars } from '../../../styles/theme.css'
import { Avatar } from '../../atoms/Avatar/Avatar'
import { Badge } from '../../atoms/Badge/Badge'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Icon } from '../../atoms/Icon/Icon'
import { Text } from '../../atoms/Text/Text'
import * as styles from './TaskItem.css'
import { TaskItemProps } from './TaskItem.types'

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  // onSelect,
  onDelete,
  onEdit,
  className
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleComplete(task.id, event.target.checked)
  }

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation() // 親要素へのクリックイベント伝播を停止 (もしあれば)
    onDelete?.(task.id) // onDelete コールバックを呼び出す
  }

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onEdit?.(task.id) // onEdit コールバックを呼び出す
  }

  // ★ ラベルの色を決定するロジック (仮 - 必要に応じて調整)
  const getLabelColorScheme = (label: string) => {
    // 簡単な例: 特定のラベルに色を割り当てる
    if (
      label.toLowerCase().includes('重要') ||
      label.toLowerCase().includes('urgent')
    )
      return 'error'
    if (
      label.toLowerCase().includes('家事') ||
      label.toLowerCase().includes('chore')
    )
      return 'secondary'
    if (
      label.toLowerCase().includes('仕事') ||
      label.toLowerCase().includes('work')
    )
      return 'primary'
    if (
      label.toLowerCase().includes('買い物') ||
      label.toLowerCase().includes('shopping')
    )
      return 'accent'
    return 'gray' // デフォルト
  }

  // 期限日のフォーマットや期限切れ判定 (仮)
  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date(new Date().toDateString())
    : false
  const formattedDueDate = task.dueDate // 必要ならフォーマット関数を使う

  const taskNameClassName = styles.taskName({ isCompleted: task.isCompleted })
  const containerClassName = styles.container({ isCompleted: task.isCompleted })

  // 担当者のイニシャル (仮 - assigneeId から生成するか、別途ユーザー情報が必要)
  const getAssigneeInitials = (id: string | null): string => {
    if (!id) return '?'
    // 簡単な例: IDの最初の2文字を大文字にする
    return id.substring(0, 2).toUpperCase()
    // 本来はユーザー名などから取得
  }
  const assigneeInitials = getAssigneeInitials(task.assigneeId ?? null)
  const assigneeAltText = task.assigneeId
    ? `担当者 ${assigneeInitials}`
    : '担当者なし' // 仮

  return (
    <li className={`${containerClassName} ${className || ''}`}>
      {/* チェックボックス */}
      <div className={styles.checkboxWrapper}>
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          onChange={handleCheckboxChange}
          aria-label={`タスク ${task.name} を完了${task.isCompleted ? '済みから未完了' : 'にする'}`}
        />
      </div>

      {/* コンテンツエリア (メイン情報 + ラベル) */}
      <div className={styles.contentWrapper}>
        {/* メイン情報ライン (アバター、名前、日付) */}
        <div className={styles.mainInfo}>
          {/* アバター */}
          <div className={styles.avatarWrapper}>
            <Avatar
              initials={assigneeInitials}
              size="sm" // 小さいサイズ
              alt={assigneeAltText}
              // 担当者がいない場合は少し薄く表示する例
              style={{ opacity: task.assigneeId ? 1 : 0.4 }}
              title={assigneeAltText} // ツールチップ
            />
          </div>
          {/* タスク名 */}
          <Text as="span" className={taskNameClassName} title={task.name}>
            {task.name}
          </Text>
          {/* 期限日 (存在する場合のみ表示) */}
          {task.dueDate && (
            <div className={styles.dueDateWrapper}>
              {/* 期限切れスタイルを適用 */}
              <span
                className={styles.dueDate[isOverdue ? 'overdue' : 'default']}
              >
                {/* カレンダーアイコン */}
                <Icon
                  as={CalendarDays}
                  size="0.9em"
                  style={{ marginRight: '4px' }}
                />
                {formattedDueDate}
              </span>
            </div>
          )}
        </div>

        {/* ラベル表示エリア (ラベルが存在する場合のみ表示) */}
        {task.labels && task.labels.length > 0 && (
          <div className={styles.labelsWrapper}>
            {task.labels.map((label) => (
              <Badge
                key={label}
                colorScheme={getLabelColorScheme(label)} // ラベルに応じて色を決定
              >
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {/* ★ 編集ボタンを追加 */}
        {onEdit && ( // onEdit が渡されている場合のみ表示
          <Button
            size="sm"
            variant="text"
            onClick={handleEditClick}
            aria-label={`タスク ${task.name} を編集`}
            style={{ padding: vars.space[1] }}
          >
            <Icon as={Pencil} size={16} /> {/* 編集アイコン */}
          </Button>
        )}
        {/* 削除ボタン */}
        {onDelete && ( // onDelete が渡されている場合のみ表示
          <Button
            size="sm" // 小さいボタン
            variant="text" // テキストボタン (背景なし)
            onClick={handleDeleteClick}
            aria-label={`タスク ${task.name} を削除`} // スクリーンリーダー向けラベル
            className={styles.deleteButton} // エラーカラーなどを適用 (任意)
            style={{ padding: vars.space[1] }} // アイコンボタンのpadding調整例
          >
            <Icon as={Trash} size={16} />
          </Button>
        )}
      </div>
    </li>
  )
}
