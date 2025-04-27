import type { LucideProps } from 'lucide-react'
import type React from 'react'

// アイコンコンポーネント自体の型 (React.ComponentType を使う)
// LucideProps を継承したコンポーネントを受け入れる
type IconComponent = React.ComponentType<LucideProps>

// Icon Atom の Props
export type IconProps = {
  as: IconComponent // 表示するアイコンコンポーネント (例: Check, Trash)
  size?: number | string // アイコンのサイズ (例: 16, '1em', '2rem')
  color?: string // アイコンの色 (例: vars.color.primary, '#ff0000')
  className?: string // 外部スタイル用
} & Omit<LucideProps, 'size' | 'color'> // 元のアイコン Props から size と color を除外
