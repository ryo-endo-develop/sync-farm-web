import { keyframes,style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 }
})

export const skeleton = style({
  display: 'block',
  backgroundColor: vars.color.border, // やや薄いグレー
  borderRadius: vars.borderRadius.sm, // 少し角丸
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  userSelect: 'none',
  WebkitUserSelect: 'none' // for Safari
})
