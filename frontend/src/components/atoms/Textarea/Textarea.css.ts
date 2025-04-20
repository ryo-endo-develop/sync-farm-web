import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

export const textarea = recipe({
  base: {
    display: 'block', // textarea は通常ブロック要素
    width: '100%',
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.md,
    padding: `${vars.space[2]} ${vars.space[3]}`, // 上下左右のパディング
    fontSize: vars.fontSize.md,
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surface,
    transition: 'border-color 0.2s ease-out, box-shadow 0.2s ease-out',
    fontFamily: vars.font.body,
    lineHeight: vars.lineHeight.normal, // textarea 内の行間
    resize: 'vertical', // 垂直方向のリサイズのみ許可 (任意)

    '::placeholder': {
      color: vars.color.textSecondary,
      opacity: 0.8
    },

    ':focus': {
      outline: 'none',
      borderColor: vars.color.primary,
      boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.primary} 30%, transparent 70%)`
    },

    ':disabled': {
      backgroundColor: `color-mix(in srgb, ${vars.color.border} 30%, ${vars.color.surface} 70%)`,
      cursor: 'not-allowed',
      opacity: 0.7
    }
  },

  variants: {
    isError: {
      true: {
        borderColor: vars.color.error,
        ':focus': {
          outline: 'none',
          borderColor: vars.color.error,
          boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.error} 30%, transparent 70%)`
        }
      }
    }
    // 必要なら size バリアントなども追加可能
  },

  defaultVariants: {
    isError: false
  }
})

export type TextareaVariants = RecipeVariants<typeof textarea>
