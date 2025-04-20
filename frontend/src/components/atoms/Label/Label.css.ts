import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

export const label = style({
  display: 'block', // または 'inline-block'
  marginBottom: vars.space[1], // 下に少しマージン
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textPrimary,
  cursor: 'pointer' // 対応する input にフォーカスが当たるため
})

// 必須マークのスタイル
export const requiredIndicator = style({
  marginLeft: vars.space[1],
  color: vars.color.error, // エラーカラーで表示
  fontWeight: vars.fontWeight.normal
})
