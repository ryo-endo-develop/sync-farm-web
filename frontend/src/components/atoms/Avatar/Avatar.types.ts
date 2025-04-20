import type React from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'

export type AvatarProps = {
  src?: string | null // 画像 URL (オプショナル)
  initials: string // src がない場合に表示するイニシャル
  size?: AvatarSize // サイズ (デフォルト 'md')
  alt?: string // 代替テキスト (src がある場合に推奨)
  className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement | HTMLImageElement>, 'children'> // div または img 要素の属性
