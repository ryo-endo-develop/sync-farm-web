import type React from 'react'

export type TextareaProps = {
  value: string | number // value は必須 (外部で制御)
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void // onChange も必須
  placeholder?: string
  disabled?: boolean
  isError?: boolean // エラー状態を示すフラグ
  rows?: number // 表示行数の目安
  id?: string // label と紐付けるため
  name?: string // フォーム送信時の名前
  className?: string // 外部スタイル注入用
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'value'
  | 'onChange'
  | 'placeholder'
  | 'disabled'
  | 'id'
  | 'name'
  | 'rows'
  | 'className'
>
// 他の textarea 属性 (required, maxLength, etc.) を受け入れ可能に
