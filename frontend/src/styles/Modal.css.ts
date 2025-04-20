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

export const dialogOverlay = style({
  backgroundColor: `color-mix(in srgb, ${vars.color.black} 40%, transparent 60%)`, // 半透明の黒
  position: 'fixed',
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 10 // 必要に応じて調整
})

export const dialogContent = style({
  backgroundColor: vars.color.background, // 背景色
  borderRadius: vars.borderRadius.lg, // 角丸
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw', // 幅
  maxWidth: '500px', // 最大幅
  maxHeight: '85vh', // 最大高さ
  padding: vars.space[6], // パディング
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  overflowY: 'auto', // 内容が多い場合にスクロール
  zIndex: 11, // Overlay より手前

  ':focus': { outline: 'none' }
})

export const dialogTitle = style({
  margin: 0,
  marginBottom: vars.space[4],
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textPrimary,
  fontSize: vars.fontSize.lg
})

export const dialogDescription = style({
  marginBottom: vars.space[5],
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.relaxed
})

export const closeButton = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3]
  // Button Atom を使うか、別途スタイル定義
})
