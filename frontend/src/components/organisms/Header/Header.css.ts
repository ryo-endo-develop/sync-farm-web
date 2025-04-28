import { style } from '@vanilla-extract/css'

import { breakpoints,vars } from '../../../styles/theme.css'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${vars.space[4]}`, // デフォルトの左右パディング (16px)
  height: '60px',
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,

  '@media': {
    [breakpoints.sp]: {
      // ★ SP サイズでは左右パディングを少し狭くする (例: 12px)
      padding: `0 ${vars.space[3]}`
    }
  }
})

export const leftSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4], // デフォルトのギャップ (16px)

  '@media': {
    [breakpoints.sp]: {
      // ★ SP サイズではギャップを狭くする (例: 8px)
      gap: vars.space[2]
    }
  }
})

export const logo = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.primary,
  textDecoration: 'none'
})

export const pageTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textPrimary,
  display: 'none',
  '@media': {
    [breakpoints.tablet]: {
      display: 'block'
    }
  }
})

export const rightSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3], // デフォルトのギャップ (12px)

  '@media': {
    [breakpoints.sp]: {
      // ★ SP サイズではギャップを狭くする (例: 8px)
      gap: vars.space[2]
    }
  }
})

export const hamburgerMenu = style({
  display: 'block',
  '@media': {
    [breakpoints.tablet]: {
      display: 'none'
    }
  }
})
