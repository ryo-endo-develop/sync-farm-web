import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { vars } from '../../../styles/theme.css'

// ★ ルートの label 要素に適用するスタイルを追加
export const labelContainer = style({
  display: 'inline-flex', // 要素を横並びにする
  alignItems: 'center', // ★ 垂直方向中央揃え
  gap: vars.space[2], // チェックボックスとラベルの間隔
  cursor: 'pointer', // クリック可能を示す
  userSelect: 'none',

  // 無効時のスタイル (data属性を利用)
  selectors: {
    '&[data-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.7 // 全体を少し薄くする
    }
  }
})

// 実際の input 要素 (視覚的に隠す) - 変更なし
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

// 見た目上のチェックボックスボックス (recipe で状態管理) - 変更なし
export const checkboxBox = recipe({
  base: {
    display: 'inline-flex', // flex を使うと中のチェックマークも揃えやすい
    alignItems: 'center',
    justifyContent: 'center',
    width: vars.fontSize.md, // 16px 程度
    height: vars.fontSize.md,
    border: `2px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.sm,
    backgroundColor: vars.color.surface,
    transition: 'border-color 0.2s ease-out, background-color 0.2s ease-out',
    flexShrink: 0
    // cursor は親の labelContainer で設定
  },
  variants: {
    isChecked: {
      true: {
        borderColor: vars.color.primary,
        backgroundColor: vars.color.primary
      }
    },
    isDisabled: {
      true: {
        borderColor: vars.color.border,
        backgroundColor: `color-mix(in srgb, ${vars.color.border} 30%, ${vars.color.surface} 70%)`
        // opacity, cursor は親の labelContainer で設定
      }
    }
  },
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

// チェックマーク - 変更なし
export const checkmark = style({
  display: 'block', // または 'flex'
  width: '100%',
  height: '100%',
  color: vars.color.white,
  opacity: 0,
  transition: 'opacity 0.1s ease-out',
  selectors: {
    [`${checkboxBox({ isChecked: true })} &`]: {
      opacity: 1
    },
    [`${checkboxBox({ isChecked: true, isDisabled: true })} &`]: {
      opacity: 0.8
    }
  }
})

// チェックボックス用ラベルのスタイル
export const labelText = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textPrimary,
  lineHeight: 1.3, // ★ line-height を調整して、チェックボックスとの高さを合わせやすくする
  // marginLeft は親の gap で設定するので削除
  // userSelect, cursor は親の labelContainer で設定
  selectors: {
    // 無効時のラベルスタイル (親の data-disabled を参照)
    [`${labelContainer}[data-disabled="true"] &`]: {
      color: vars.color.textSecondary
      // opacity は親で設定
    }
  }
})
