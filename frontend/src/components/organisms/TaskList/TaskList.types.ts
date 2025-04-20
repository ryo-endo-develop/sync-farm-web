import type { Task } from '../../../generated/api' // Task 型をインポート

export interface TaskListProps {
  tasks: Task[] | undefined // タスクデータの配列 or 未取得状態
  isLoading: boolean // ローディング中フラグ
  isError: boolean // エラー発生フラグ
  error?: any // エラーオブジェクト (詳細表示用)
  // 今後、フィルター/ソート関数、タスク操作関数なども Props として受け取る
}
