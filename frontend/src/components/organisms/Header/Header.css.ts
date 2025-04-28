import { style } from '@vanilla-extract/css'

import { breakpoints,vars } from '../../../styles/theme.css'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // 要素を左右に配置
  padding: `0 ${vars.space[4]}`, // 左右のパディング (16px)
  height: '60px', // ヘッダーの高さ (例)
  backgroundColor: vars.color.surface, // 背景色
  borderBottom: `1px solid ${vars.color.border}`, // 下線
  position: 'sticky', // スクロールしても上部に固定 (任意)
  top: 0,
  zIndex: 10 // 他の要素より手前に表示
})

export const leftSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4] // ロゴとタイトルの間隔
})

export const logo = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.primary, // ロゴの色
  textDecoration: 'none' // Link の場合の下線消し
})

export const pageTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textPrimary,
  display: 'none', // デフォルト (SP) では隠す
  '@media': {
    [breakpoints.tablet]: {
      // Tablet 以上で表示
      display: 'block'
    }
  }
})

export const rightSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3] // アイコンとユーザーメニューの間隔
})

export const hamburgerMenu = style({
  display: 'block',
  '@media': {
    [breakpoints.tablet]: {
      // Tablet 以上で非表示
      display: 'none'
    }
  }
})
