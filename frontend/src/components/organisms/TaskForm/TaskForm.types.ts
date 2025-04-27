import { CreateTaskFormData } from '../../../schemas/taskSchema'

export type TaskFormInitialValues = Partial<CreateTaskFormData>
export type TaskFormProps = {
  // フォーム送信時に呼び出される関数 (バリデーション成功後)
  // Promise を返すようにしておくと、呼び出し側で非同期処理の完了を待てる
  onSubmit: (data: CreateTaskFormData) => Promise<void> | void
  onCancel?: () => void // キャンセル時に呼び出される関数 (任意)
  isLoading?: boolean // フォーム送信中のローディング状態
  // --- 以下は編集時に使用 ---
  initialValues?: Partial<CreateTaskFormData> // フォームの初期値 (編集用)
  isEditing?: boolean // 編集モードかどうかのフラグ (今回は使わない)
}
