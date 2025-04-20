import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

// Text コンポーネントの基本的なスタイル (任意)
export const textBase = style({
  margin: 0, // デフォルトのマージンをリセット
  padding: 0,
  fontFamily: vars.font.body // 基本フォント
  // 必要に応じてデフォルトの色や行間などを設定してもよい
  // color: vars.color.textPrimary,
  // lineHeight: vars.lineHeight.normal,
})

// 特定のタグに対するスタイル調整 (例)
export const headingStyle = style({
  // 例: h1, h2 などに適用したい共通スタイルがあれば記述
  // fontWeight: vars.fontWeight.bold, // sprinkles で指定する方が柔軟かも
})
