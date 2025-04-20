import { style, styleVariants } from '@vanilla-extract/css'
import { recipe, RecipeVariants } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

// input要素を囲むコンテナ (アイコン配置のため)
export const container = style({
  position: 'relative', // アイコンを絶対配置する場合の基準
  display: 'inline-flex', // または 'flex' 幅に応じて調整
  alignItems: 'center',
  width: '100%' // デフォルトで親要素に合わせる (必要に応じて調整)
})

// アイコンの共通スタイル
const iconBase = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textSecondary, // アイコンの色
  pointerEvents: 'none', // アイコンがクリックイベントを妨げないように
  width: `calc(${vars.fontSize.md} * 1.5)`, // アイコン領域の幅 (仮)
  height: '100%'
})

// アイコンの位置 (左右)
export const icon = styleVariants({
  left: [iconBase, { left: '0px' }],
  right: [iconBase, { right: '0px' }]
})

// input要素本体のスタイルを recipe で定義
export const input = recipe({
  base: {
    width: '100%',
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.md,
    paddingTop: vars.space[2],
    paddingBottom: vars.space[2],
    paddingLeft: vars.space[3], // デフォルトの左パディング
    paddingRight: vars.space[3], // デフォルトの右パディング
    fontSize: vars.fontSize.md,
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surface, // 背景色
    transition: 'border-color 0.2s ease-out, box-shadow 0.2s ease-out',
    fontFamily: vars.font.body,
    lineHeight: vars.lineHeight.normal, // input 内の行間

    '::placeholder': {
      color: vars.color.textSecondary,
      opacity: 0.8
    },

    ':focus': {
      // :focus-visible の方が良い場合もある
      outline: 'none',
      borderColor: vars.color.primary,
      boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.primary} 30%, transparent 70%)` // フォーカスリング
    },

    ':disabled': {
      backgroundColor: `color-mix(in srgb, ${vars.color.border} 30%, ${vars.color.surface} 70%)`, // 少しグレーに
      cursor: 'not-allowed',
      opacity: 0.7
    }
  },

  variants: {
    // エラー状態
    isError: {
      true: {
        borderColor: vars.color.error,
        ':focus': {
          // エラー時のフォーカス色も変更
          outline: 'none',
          borderColor: vars.color.error,
          boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.error} 30%, transparent 70%)`
        }
      }
    },
    // 左アイコン有無によるpadding調整
    hasLeftIcon: {
      true: {
        // アイコンの幅 + 少しスペース
        paddingLeft: `calc(${vars.fontSize.md} * 1.5 + ${vars.space[2]})`
      }
    },
    // 右アイコン有無によるpadding調整
    hasRightIcon: {
      true: {
        paddingRight: `calc(${vars.fontSize.md} * 1.5 + ${vars.space[2]})`
      }
    }
    // (任意) サイズバリアントなど追加可能
    // size: {
    //   sm: { fontSize: vars.fontSize.sm, /* padding など調整 */ },
    //   lg: { fontSize: vars.fontSize.lg, /* padding など調整 */ },
    // }
  },

  // デフォルトのバリアント値 (ここでは isError: false など)
  defaultVariants: {
    isError: false,
    hasLeftIcon: false,
    hasRightIcon: false
  }
})

export type InputVariants = RecipeVariants<typeof input>
