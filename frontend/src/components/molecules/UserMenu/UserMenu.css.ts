import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

// ドロップダウンが開くアニメーション (任意)
const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
})

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' }
})

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
})

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' }
})

// ドロップダウンメニュー本体 (Content) のスタイル
export const dropdownContent = style({
  minWidth: 220, // 最小幅
  backgroundColor: vars.color.background, // 背景色
  borderRadius: vars.borderRadius.lg, // 角丸
  padding: vars.space[2], // 内側のパディング (8px)
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 5px 16px -5px rgba(22, 23, 24, 0.2)', // 影
  zIndex: 20, // ヘッダーより手前に表示
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',

  // 開いたときの状態にアニメーションを適用
  selectors: {
    '&[data-state="open"][data-side="top"]': {
      animationName: slideDownAndFade
    },
    '&[data-state="open"][data-side="right"]': {
      animationName: slideLeftAndFade
    },
    '&[data-state="open"][data-side="bottom"]': {
      animationName: slideUpAndFade
    },
    '&[data-state="open"][data-side="left"]': {
      animationName: slideRightAndFade
    }
  }
})

// メニュー項目 (Item) の共通スタイル
const itemBase = {
  fontSize: vars.fontSize.sm,
  lineHeight: 1, // アイコンとテキストを揃えるため
  color: vars.color.textPrimary,
  borderRadius: vars.borderRadius.sm, // 項目の角丸
  display: 'flex',
  alignItems: 'center',
  height: 35, // 項目の高さ (例)
  padding: `0 ${vars.space[2]}`, // 左右のパディング
  position: 'relative' as const, // 型アサーション
  userSelect: 'none' as const,
  outline: 'none',
  cursor: 'pointer',
  gap: vars.space[2] // アイコンとテキストの間隔
}

// メニュー項目 (Item) のスタイル
export const dropdownItem = style({
  ...itemBase, // 共通スタイルを継承

  // ハイライト時 (マウスホバーやキーボードフォーカス) のスタイル
  selectors: {
    '&[data-disabled]': {
      color: vars.color.textSecondary,
      opacity: 0.6,
      pointerEvents: 'none'
    },
    '&[data-highlighted]': {
      backgroundColor: vars.color.primary,
      color: vars.color.white // テキストの色はここで変更
      // '& svg': { color: vars.color.white } // ← この行を削除
    }
  }
})

// 区切り線 (Separator) のスタイル
export const dropdownSeparator = style({
  height: 1,
  backgroundColor: vars.color.border,
  margin: `${vars.space[2]} -${vars.space[1]}` // 上下のマージンと左右のネガティブマージン
})

// アイコン用のスタイル (任意)
export const itemIcon = style({
  color: vars.color.textSecondary, // 通常時のアイコン色
  selectors: {
    // dropdownItem がハイライトされた場合に、この itemIcon の色を変更
    [`${dropdownItem}[data-highlighted] &`]: {
      color: vars.color.white
    }
  }
})

// トリガー (Avatar) のスタイル (任意)
export const dropdownTrigger = style({
  cursor: 'pointer',
  borderRadius: vars.borderRadius.full, // フォーカスリング用
  ':focus-visible': {
    // キーボード操作時のフォーカスリング
    outline: `3px solid ${vars.color.primary}`,
    outlineOffset: '2px'
  }
})
