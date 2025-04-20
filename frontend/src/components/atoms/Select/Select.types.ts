import type React from 'react'

// 選択肢の型
export type SelectOption = {
  value: string | number // 送信される値 (例: ユーザーID)
  label: string // 表示されるテキスト (例: ユーザー名)
  disabled?: boolean // 特定の選択肢を無効化する場合
}

// Select コンポーネントの Props
export type SelectProps = {
  options: SelectOption[] // 選択肢の配列
  value: string | number | undefined // 選択されている値 (外部制御)
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void // 変更ハンドラ
  placeholder?: string // 未選択時の表示テキスト (例: "選択してください")
  disabled?: boolean
  isError?: boolean // エラー状態
  id?: string // label と紐付けるため
  name?: string
  className?: string // コンテナ要素へのクラス
} & Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'onChange' | 'disabled' | 'id' | 'name' | 'className' | 'children' // children は options から生成
>
