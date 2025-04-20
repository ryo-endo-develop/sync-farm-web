import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

// チェックボックスとラベルを囲むコンテナ
export const container = style({
  display: 'inline-flex', // ラベルとチェックボックスを横並び
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  gap: vars.space[2] // チェックボックスとラベルの間隔
})

// 実際の input 要素 (視覚的に隠す)
export const hiddenInput = style({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap'
})

// 見た目上のチェックボックスボックス
export const checkboxBox = recipe({
  base: {
    display: 'inline-block',
    width: vars.fontSize.md, // フォントサイズ基準のサイズ (例: 16px)
    height: vars.fontSize.md,
    border: `2px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.sm, // 少し角丸
    backgroundColor: vars.color.surface,
    transition: 'border-color 0.2s ease-out, background-color 0.2s ease-out',
    flexShrink: 0 // コンテナが縮んでも潰れないように
  },
  variants: {
    isChecked: {
      true: {
        borderColor: vars.color.primary,
        backgroundColor: vars.color.primary
      }
      // false: { // isChecked=false は base のスタイルを使う }
    },
    isDisabled: {
      true: {
        borderColor: vars.color.border,
        backgroundColor: `color-mix(in srgb, ${vars.color.border} 30%, ${vars.color.surface} 70%)`,
        opacity: 0.7
      }
    }
  },
  // 複合バリアント: チェックされていて無効な場合など
  compoundVariants: [
    {
      variants: { isChecked: true, isDisabled: true },
      style: {
        borderColor: `color-mix(in srgb, ${vars.color.primary} 50%, ${vars.color.border} 50%)`,
        backgroundColor: `color-mix(in srgb, ${vars.color.primary} 50%, ${vars.color.border} 50%)`
      }
    }
  ],
  defaultVariants: {
    isChecked: false,
    isDisabled: false
  }
})

// チェックマーク (SVGや疑似要素で表現)
export const checkmark = style({
  display: 'block', // または 'inline-block'
  width: '100%', // 親要素(checkboxBox)に合わせる
  height: '100%',
  color: vars.color.white, // チェックマークの色 (チェック時)
  opacity: 0, // デフォルトは非表示
  transition: 'opacity 0.1s ease-out',
  selectors: {
    // isChecked=true の場合に表示
    [`${checkboxBox({ isChecked: true })} &`]: {
      opacity: 1
    },
    // 無効時は少し薄く
    [`${checkboxBox({ isChecked: true, isDisabled: true })} &`]: {
      opacity: 0.8 // または色を変える
      // color: vars.color.textSecondary,
    }
  }
})

// チェックボックス用ラベルのスタイル (オプション)
export const labelText = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textPrimary,
  lineHeight: vars.lineHeight.normal,

  // 無効時のラベルスタイル
  selectors: {
    [`${container}:has(${hiddenInput}:disabled) &`]: {
      color: vars.color.textSecondary,
      opacity: 0.7
    }
  }
})
