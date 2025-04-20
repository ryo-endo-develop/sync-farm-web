// src/components/atoms/Button/Button.types.ts (修正版 - Zod不使用)
import type React from 'react'

// ボタンのバリアント (見た目) - Union Typeで定義
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'text'
  | 'danger'

// ボタンのサイズ - Union Typeで定義
export type ButtonSize = 'sm' | 'md' | 'lg'

// ボタンの type 属性 - Union Typeで定義
export type ButtonType = 'button' | 'submit' | 'reset'

// ButtonコンポーネントのProps型定義
export type ButtonProps = {
  variant?: ButtonVariant // オプショナルにする (デフォルト値はコンポーネント側で設定)
  size?: ButtonSize // オプショナルにする
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  isLoading?: boolean
  iconLeft?: React.ReactElement // React要素の型を直接使う
  iconRight?: React.ReactElement
  children?: React.ReactNode // Reactノードの型を直接使う
  type?: ButtonType // オプショナルにする
  className?: string // 外部スタイル注入用 (任意)
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled' | 'children'
>
// Omit を使って、標準の button 属性から重複するものを除外しつつ、
// aria-* や data-* などの他の属性を受け入れられるようにする
