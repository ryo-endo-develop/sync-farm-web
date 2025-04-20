// src/components/organisms/TaskList/TaskList.css.ts (任意)
import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/theme.css'

export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginTop: vars.space[4]
})

export const listItem = style({
  padding: `${vars.space[2]} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
  ':last-child': {
    borderBottom: 'none'
  }
})

export const loading = style({
  padding: vars.space[4],
  textAlign: 'center',
  color: vars.color.textSecondary
})

export const error = style({
  padding: vars.space[4],
  color: vars.color.error,
  border: `1px solid ${vars.color.error}`,
  borderRadius: vars.borderRadius.md,
  backgroundColor: `color-mix(in srgb, ${vars.color.error} 10%, transparent 90%)`
})

export const empty = style({
  padding: vars.space[4],
  textAlign: 'center',
  color: vars.color.textSecondary
})
