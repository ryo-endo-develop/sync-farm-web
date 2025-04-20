import React from 'react'

import * as styles from './TaskList.css' // スタイルをインポート (任意)
import type { TaskListProps } from './TaskList.types' // 型定義をインポート (任意)

// TaskListProps を直接定義してもOK
// interface TaskListProps {
//   tasks: Task[] | undefined;
//   isLoading: boolean;
//   isError: boolean;
//   error?: any;
// }

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  isError,
  error
}) => {
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
        // 将来的には TaskItem Molecule コンポーネントを使う
        <li key={task.id} className={styles.listItem}>
          <input
            type="checkbox"
            checked={task.isCompleted}
            readOnly
            style={{ marginRight: '8px' }}
          />
          <span>{task.name}</span>
          <span
            style={{ fontSize: '0.8em', marginLeft: '8px', color: '#6c757d' }}
          >
            {task.dueDate ? `(期限: ${task.dueDate})` : ''}
          </span>
          {/* ここに更新・削除ボタンなどを後で追加 */}
        </li>
      ))}
    </ul>
  )
}
