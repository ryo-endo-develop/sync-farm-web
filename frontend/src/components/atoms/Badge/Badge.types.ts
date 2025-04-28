import type React from 'react'

// バッジのカラースキーマ
export type BadgeColorScheme =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'error'
  | 'gray' // ガイドラインにあるもの + 一般的なグレー

// Badge コンポーネントの Props
export type BadgeProps = {
  colorScheme?: BadgeColorScheme // 色 (デフォルト 'gray')
  children: React.ReactNode // 表示するテキストなど
  className?: string // 外部スタイル用
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>
