// src/components/atoms/Input/Input.types.ts
import type React from 'react'

// Input要素の基本的な type 属性 + α
export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'time'

// InputコンポーネントのProps型定義
export type InputProps = {
  type?: InputType // デフォルトは 'text'
  value: string | number // value は必須 (外部で制御)
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void // onChange も必須
  placeholder?: string
  disabled?: boolean
  isError?: boolean // エラー状態を示すフラグ
  iconLeft?: React.ReactElement
  iconRight?: React.ReactElement
  id?: string // label と紐付けるため
  name?: string // フォーム送信時の名前
  className?: string // 外部スタイル注入用
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'value'
  | 'onChange'
  | 'placeholder'
  | 'disabled'
  | 'id'
  | 'name'
  | 'className'
>
// Omit を使って重複を除外しつつ、他の input 属性 (required, maxLength, etc.) を受け入れ可能に
