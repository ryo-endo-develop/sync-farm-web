import type React from 'react'

export type CheckboxProps = {
  checked: boolean // チェック状態 (外部制御)
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void // 状態変更関数
  disabled?: boolean
  label?: React.ReactNode // チェックボックスの横に表示するラベル
  id: string // label と紐付けるため、必須
  name?: string
  className?: string // コンテナ要素へのクラス
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange' | 'disabled' | 'id' | 'name' | 'className'
>
