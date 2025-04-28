import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

// ul 要素に適用するスタイル
export const list = style({
  listStyle: 'none', // リストマーカーを消す
  padding: 0, // デフォルトのパディングを削除
  margin: 0, // デフォルトのマージンを削除
  marginTop: vars.space[4], // 上にスペースを追加 (16px)
  border: `1px solid ${vars.color.border}`, // リスト全体を囲むボーダー (任意)
  borderRadius: vars.borderRadius.lg, // 角丸 (大) (任意)
  backgroundColor: vars.color.surface, // 背景色 (任意、Item と同じでも良い)
  overflow: 'hidden' // borderRadius を効かせるため (任意)
})

// listItem スタイルは TaskItem の container で管理するため不要になることが多い
// export const listItem = style({ ... });

// ローディング表示のスタイル
export const loading = style({
  padding: vars.space[6], // 十分なパディング
  textAlign: 'center',
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.md
})

// エラー表示のスタイル
export const error = style({
  padding: vars.space[4], // パディング
  margin: `${vars.space[4]} 0`, // 上下マージン
  color: vars.color.error, // エラーテキスト色
  border: `1px solid ${vars.color.error}`, // エラーボーダー
  borderRadius: vars.borderRadius.md, // 角丸
  backgroundColor: `color-mix(in srgb, ${vars.color.error} 10%, transparent 90%)` // 薄いエラー背景色
})

// タスクが空の場合の表示スタイル
export const empty = style({
  padding: vars.space[6], // 十分なパディング
  textAlign: 'center',
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.md
})
