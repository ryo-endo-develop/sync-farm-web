import { style } from '@vanilla-extract/css'

import { breakpoints, vars } from '../../styles/theme.css'

export const layout = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: vars.color.background
})

export const container = style({
  display: 'flex',
  flexGrow: 1
})

export const navPlaceholder = style({
  width: '240px',
  backgroundColor: vars.color.surface,
  borderRight: `1px solid ${vars.color.border}`,
  flexShrink: 0,
  padding: vars.space[4],
  display: 'block',

  '@media': {
    [breakpoints.tablet]: {
      width: '80px'
    },
    [breakpoints.sp]: {
      display: 'none' // SP では非表示 (変更なし)
    }
  }
})

export const mainContent = style({
  flexGrow: 1,
  padding: vars.space[6], // デフォルトのパディング (24px)
  overflowY: 'auto',

  '@media': {
    [breakpoints.sp]: {
      // ★ SP サイズではパディングを狭くする (例: 16px)
      padding: vars.space[4]
    }
  }
})
