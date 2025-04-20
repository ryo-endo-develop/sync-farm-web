import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4]
})

export const formField = style({
  // 必要ならスタイル追加
})

export const errorMessage = style({
  marginTop: vars.space[1],
  color: vars.color.error,
  fontSize: vars.fontSize.sm
})

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space[2],
  marginTop: vars.space[4]
})
