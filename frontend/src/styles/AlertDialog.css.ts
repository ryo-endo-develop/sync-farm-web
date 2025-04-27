import { keyframes,style } from '@vanilla-extract/css'

import { vars } from './theme.css'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
})

export const alertDialogOverlay = style({
  backgroundColor: `color-mix(in srgb, ${vars.color.black} 40%, transparent 60%)`,
  position: 'fixed',
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 20 // モーダルより手前に表示する場合
})

export const alertDialogContent = style({
  backgroundColor: vars.color.background,
  borderRadius: vars.borderRadius.lg,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px', // 少し小さめにする場合
  maxHeight: '85vh',
  padding: vars.space[6],
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 21, // Overlay より手前

  ':focus': { outline: 'none' }
})

export const alertDialogTitle = style({
  margin: 0,
  marginBottom: vars.space[2], // Description との間隔調整
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textPrimary,
  fontSize: vars.fontSize.lg
})

export const alertDialogDescription = style({
  marginBottom: vars.space[5],
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.relaxed
})

// AlertDialog 内のボタン配置用スタイル
export const alertDialogFooter = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space[3], // ボタン間のスペース
  marginTop: vars.space[5]
})
