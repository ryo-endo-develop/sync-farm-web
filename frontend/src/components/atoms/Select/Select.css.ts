import { style } from '@vanilla-extract/css'
import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

// select 要素を含むコンテナ (矢印アイコンの配置のため)
export const container = style({
  position: 'relative',
  display: 'inline-block', // または 'block'
  width: '100%' // デフォルトで親要素に合わせる
})

// select 要素本体のスタイル (Input とほぼ共通)
export const select = recipe({
  base: {
    appearance: 'none', // ブラウザ標準の矢印を消す
    width: '100%',
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.md,
    paddingTop: vars.space[2],
    paddingBottom: vars.space[2],
    paddingLeft: vars.space[3],
    paddingRight: vars.space[8], // ★ 矢印のスペースを確保するため右パディングを広めに
    fontSize: vars.fontSize.md,
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surface,
    transition: 'border-color 0.2s ease-out, box-shadow 0.2s ease-out',
    fontFamily: vars.font.body,
    lineHeight: vars.lineHeight.normal,
    cursor: 'pointer',

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
    // 他のバリアント (size など) も追加可能
  },
  defaultVariants: {
    isError: false
  }
})

export type SelectVariants = RecipeVariants<typeof select>

// 矢印アイコンのスタイル
export const icon = style({
  position: 'absolute',
  top: '50%',
  right: vars.space[3], // 右端からの位置
  transform: 'translateY(-50%)',
  pointerEvents: 'none', // クリックを select 要素に透過させる
  color: vars.color.textSecondary,
  selectors: {
    // disabled 時のスタイル
    [`${container}:has(${select()}:disabled) &`]: {
      opacity: 0.5
    }
  }
})
