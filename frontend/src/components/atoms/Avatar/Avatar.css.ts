import { style } from '@vanilla-extract/css'
import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

// Avatarコンテナのスタイル (recipe)
export const avatar = recipe({
  base: {
    display: 'inline-flex', // または 'flex'
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vars.borderRadius.full, // 完全な円
    overflow: 'hidden', // 画像がはみ出さないように
    backgroundColor: vars.color.secondary, // 画像がない場合の背景色 (例)
    color: vars.color.textPrimary, // イニシャルの色
    fontWeight: vars.fontWeight.medium,
    userSelect: 'none',
    flexShrink: 0 // flex レイアウトで縮まないように
  },
  variants: {
    size: {
      sm: {
        width: '24px', // Small size
        height: '24px',
        fontSize: vars.fontSize.xs // イニシャル用フォントサイズ
      },
      md: {
        width: '40px', // Medium size (デフォルト)
        height: '40px',
        fontSize: vars.fontSize.sm
      },
      lg: {
        width: '64px', // Large size
        height: '64px',
        fontSize: vars.fontSize.lg
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

export type AvatarVariants = RecipeVariants<typeof avatar>

// img 要素用のスタイル
export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover' // 画像のアスペクト比を保ちつつコンテナを埋める
})
