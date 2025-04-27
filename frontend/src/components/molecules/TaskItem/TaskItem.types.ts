import type { Task } from '../../../generated/api'

export type TaskItemProps = {
  task: Task // 表示するタスクデータ
  // チェックボックスの状態が変更されたときに呼び出される関数
  onToggleComplete: (taskId: string, isCompleted: boolean) => void
  // (オプション) タスク項目全体がクリックされたときなど
  // onSelect?: (taskId: string) => void;
  // (オプション) 削除ボタンがクリックされたときなど
  onDelete?: (taskId: string) => void
  // (オプション) 更新ボタンがクリックされたときなど
  // onEdit?: (taskId: string) => void;
  className?: string
}
