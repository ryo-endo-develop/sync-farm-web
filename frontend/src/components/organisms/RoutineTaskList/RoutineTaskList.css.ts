import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: 0
})

export const listItem = style({
  // 必要ならスタイル追加 (例: 区切り線)
  // borderBottom: `1px dashed ${vars.color.border}`,
  // ':last-child': {
  //   borderBottom: 'none',
  // }
})

export const empty = style({
  padding: `${vars.space[2]} 0`,
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.sm,
  textAlign: 'center'
})
