import { CalendarDays, Trash } from 'lucide-react' // アイコン例
import React from 'react'

import { vars } from '../../../styles/theme.css'
import { Avatar } from '../../atoms/Avatar/Avatar'
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
  // onEdit,
  className
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleComplete(task.id, event.target.checked)
  }

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation() // 親要素へのクリックイベント伝播を停止 (もしあれば)
    onDelete?.(task.id) // onDelete コールバックを呼び出す
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

      {/* タスク名と詳細 */}
      <div className={styles.content}>
        <Text as="span" className={taskNameClassName} title={task.name}>
          {task.name}
        </Text>
        <div className={styles.details}>
          <Avatar
            // src={null} // 将来的にユーザー画像URLを渡す
            initials={assigneeInitials}
            size="sm" // 小さいサイズ
            alt={assigneeAltText}
            // 担当者がいない場合は少し薄く表示する例 (CSSで制御も可)
            style={{ opacity: task.assigneeId ? 1 : 0.4 }}
            title={assigneeAltText} // ツールチップ
          />

          {/* 期限日 */}
          {task.dueDate && (
            // 期限切れスタイルを適用 (例)
            <Text
              as="span"
              fontSize="sm"
              color="textSecondary"
              className={styles.dueDate[isOverdue ? 'overdue' : 'default']}
            >
              <CalendarDays
                size="0.9em"
                style={{ marginRight: '4px', verticalAlign: 'middle' }}
              />
              {formattedDueDate}
            </Text>
          )}
        </div>
      </div>

      <div className={styles.actions}>
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
