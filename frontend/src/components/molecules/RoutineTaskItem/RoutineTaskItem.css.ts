import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  padding: `${vars.space[2]} 0`, // 上下のパディングのみ
  gap: vars.space[2]
})

export const checkboxWrapper = style({
  flexShrink: 0
})

export const taskName = recipe({
  base: {
    fontSize: vars.fontSize.md,
    color: vars.color.textPrimary,
    lineHeight: 1.3, // チェックボックスと高さを合わせる
    cursor: 'default',
    flexGrow: 1,
    // 完了時のスタイルはここで定義
    transition: 'color 0.2s ease-out, text-decoration 0.2s ease-out'
  },
  variants: {
    isCompleted: {
      true: {
        color: vars.color.textSecondary,
        textDecoration: 'line-through'
      }
    }
  },
  defaultVariants: {
    isCompleted: false
  }
})
