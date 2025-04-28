import { style } from '@vanilla-extract/css'

import { breakpoints,vars } from '../../../styles/theme.css'

export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginTop: vars.space[4], // デフォルトの上のマージン (16px)
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.lg,
  backgroundColor: vars.color.surface,
  overflow: 'hidden',

  '@media': {
    [breakpoints.sp]: {
      // ★ SP サイズでは上のマージンを少し減らす (例: 12px)
      marginTop: vars.space[3]
      // ★ SP ではボーダーや角丸をなくしてスッキリさせる (任意)
      // border: 'none',
      // borderRadius: 0,
      // backgroundColor: 'transparent',
    }
  }
})

export const loading = style({
  padding: vars.space[6], // デフォルト (24px)
  textAlign: 'center',
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.md,
  '@media': {
    [breakpoints.sp]: {
      padding: vars.space[4] // SP ではパディングを減らす (16px)
    }
  }
})

export const error = style({
  padding: vars.space[4], // デフォルト (16px)
  margin: `${vars.space[4]} 0`,
  color: vars.color.error,
  border: `1px solid ${vars.color.error}`,
  borderRadius: vars.borderRadius.md,
  backgroundColor: `color-mix(in srgb, ${vars.color.error} 10%, transparent 90%)`,
  '@media': {
    [breakpoints.sp]: {
      padding: vars.space[3], // SP ではパディングを減らす (12px)
      margin: `${vars.space[3]} 0`
    }
  }
})

export const empty = style({
  padding: vars.space[6], // デフォルト (24px)
  textAlign: 'center',
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.md,
  '@media': {
    [breakpoints.sp]: {
      padding: vars.space[4] // SP ではパディングを減らす (16px)
    }
  }
})
