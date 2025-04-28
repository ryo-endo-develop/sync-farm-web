import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'
import {
  dropdownContent,
  dropdownItem
} from '../../molecules/UserMenu/UserMenu.css'

// Popover のトリガーとなるボタンのスタイル
export const triggerButton = style({
  // Input Atom のスタイルに似せる
  appearance: 'none',
  display: 'flex', // 中の要素を横並びにする
  alignItems: 'center',
  justifyContent: 'space-between', // 値エリアとアイコンを両端揃え
  width: '100%',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  padding: `${vars.space[2]} ${vars.space[3]}`, // Input と同じパディング
  fontSize: vars.fontSize.md,
  backgroundColor: vars.color.surface,
  color: vars.color.textPrimary,
  textAlign: 'left', // 文字を左揃え
  cursor: 'pointer',
  transition: 'border-color 0.2s ease-out, box-shadow 0.2s ease-out',
  fontFamily: vars.font.body,
  minHeight: '42px', // Input と高さを合わせる目安

  ':focus': {
    outline: 'none',
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.primary} 30%, transparent 70%)`
  },

  ':disabled': {
    backgroundColor: `color-mix(in srgb, ${vars.color.border} 30%, ${vars.color.surface} 70%)`,
    cursor: 'not-allowed',
    opacity: 0.7
  },

  // エラー時のスタイル (aria-invalid 属性を利用)
  selectors: {
    // ★ aria-invalid="true" の場合の通常スタイル
    '&[aria-invalid="true"]': {
      borderColor: vars.color.error
    },
    // ★★★ 修正点: aria-invalid="true" かつ :focus の場合のスタイル ★★★
    '&[aria-invalid="true"]:focus': {
      outline: 'none', // :focus のスタイルをここで上書き
      borderColor: vars.color.error,
      boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.error} 30%, transparent 70%)`
    },
    // 必要であれば :focus-visible も同様に定義
    '&[aria-invalid="true"]:focus-visible': {
      outline: 'none',
      borderColor: vars.color.error,
      boxShadow: `0 0 0 2px color-mix(in srgb, ${vars.color.error} 30%, transparent 70%)`
    }
  }
})

// 選択されたラベル (Badge) を表示するエリア
export const triggerValue = style({
  display: 'flex',
  flexWrap: 'wrap', // ラベルが複数ある場合に折り返す
  gap: vars.space[1], // Badge 間のスペース
  flexGrow: 1, // スペースを埋める
  overflow: 'hidden' // はみ出したら隠す
})

// トリガーボタン内の Badge のスタイル調整 (任意)
export const triggerBadge = style({
  // 必要ならマージンなどを調整
})

// 「ラベルを選択...」プレースホルダーのスタイル
export const placeholder = style({
  color: vars.color.textSecondary,
  opacity: 0.8
})

// トリガーボタン右端の Chevron アイコンのスタイル
export const triggerIcon = style({
  color: vars.color.textSecondary,
  marginLeft: vars.space[2], // 左側に少しマージン
  flexShrink: 0 // 縮まないように
})

// Popover のコンテンツエリア (ドロップダウン部分)
// UserMenu のスタイルを流用するか、新しく定義
export const popoverContent = style([
  dropdownContent, // UserMenu のスタイルを流用
  {
    // 必要なら UserMenu と異なるスタイルを上書き
    maxHeight: '200px', // 高さに制限を設けてスクロールさせる
    overflowY: 'auto',
    padding: vars.space[1] // 少し狭める
  }
])

// Popover 内の各チェックボックス項目のスタイル
export const checkboxItem = style([
  dropdownItem, // UserMenu の Item スタイルを流用
  {
    // UserMenu と異なるスタイルを上書き
    height: 'auto', // 高さを自動に
    minHeight: '35px',
    padding: `${vars.space[1]} ${vars.space[2]}`, // パディング調整
    gap: vars.space[2], // チェックボックスとラベルの間隔
    // ハイライト時の背景色などを調整しても良い
    selectors: {
      '&[data-highlighted]': {
        // backgroundColor: vars.color.primary, // UserMenu と同じで良ければ不要
      }
    }
  }
])

// Radix Checkbox の Root 要素のスタイル
export const checkboxRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.fontSize.md, // 16px 程度
  height: vars.fontSize.md,
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.sm,
  transition: 'background-color 0.1s ease-out, border-color 0.1s ease-out',
  flexShrink: 0,

  // チェックされたときのスタイル (data-state 属性を利用)
  selectors: {
    '&[data-state="checked"]': {
      backgroundColor: vars.color.primary,
      borderColor: vars.color.primary
    }
  },

  // フォーカス時のスタイル (任意)
  ':focus-visible': {
    outline: `2px solid ${vars.color.primary}`,
    outlineOffset: '1px'
  }
})

// Radix Checkbox の Indicator 要素 (チェックマーク) のスタイル
export const checkboxIndicator = style({
  color: vars.color.white, // チェックマークの色
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

// チェックボックスの隣のラベルのスタイル
export const checkboxLabel = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textPrimary,
  lineHeight: 1.4, // 少し行間を確保
  userSelect: 'none', // テキスト選択不可
  flexGrow: 1 // 残りのスペースを埋める
})
