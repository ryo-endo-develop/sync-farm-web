import type React from 'react'

export type LabelProps = {
  htmlFor: string // 関連付ける input 要素の id
  children: React.ReactNode // ラベルテキスト
  required?: boolean // 必須項目かどうかを示すフラグ
  className?: string // 外部スタイル注入用
} & Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor' | 'children'>
// 標準の label 属性も受け入れ可能に
