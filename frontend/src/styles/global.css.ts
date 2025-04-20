// src/styles/global.css.ts
import { globalStyle } from '@vanilla-extract/css'

import { vars } from './theme.css' // Import theme variables

// Basic reset and global styles
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0
})

globalStyle('html, body', {
  height: '100%'
})

globalStyle('body', {
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.normal,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.background,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
})

globalStyle('#root', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
})

// Add other global styles as needed (e.g., link styles, list styles)
globalStyle('a', {
  color: vars.color.primary,
  textDecoration: 'none'
})

globalStyle('a:hover', {
  textDecoration: 'underline'
})
