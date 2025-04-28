import { style } from '@vanilla-extract/css'

import { breakpoints,vars } from '../../../styles/theme.css'

// サイドナビゲーション全体のコンテナ (nav 要素に適用)
export const navContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%', // 親要素 (AppLayout.container) の高さいっぱいを使う
  paddingTop: vars.space[4], // 上部に少し余白
  paddingBottom: vars.space[4]
  // AppLayout.css.ts の navPlaceholder スタイルと連携
})

// ナビゲーションリンクのリスト (ul 要素に適用)
export const navList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2] // リンク間のスペース
})

// 各ナビゲーションリンク (NavLink に適用するスタイル)
export const navLink = style({
  display: 'flex',
  alignItems: 'center',
  padding: `${vars.space[2]} ${vars.space[4]}`, // 内側のパディング
  borderRadius: vars.borderRadius.md,
  color: vars.color.textSecondary, // 通常時のテキスト・アイコン色
  textDecoration: 'none',
  transition: 'background-color 0.1s ease-out, color 0.1s ease-out',
  fontWeight: vars.fontWeight.medium,
  fontSize: vars.fontSize.md,
  whiteSpace: 'nowrap', // テキストを折り返さない

  // ホバー時のスタイル
  ':hover': {
    backgroundColor: `color-mix(in srgb, ${vars.color.primary} 10%, transparent 90%)`,
    color: vars.color.primary
  }

  // アクティブ状態のスタイル (NavLink の className or style prop で適用)
  // 例: '.active' クラスが付与された場合
  // selectors: {
  //   '&.active': {
  //     backgroundColor: `color-mix(in srgb, ${vars.color.primary} 15%, transparent 85%)`,
  //     color: vars.color.primary,
  //     fontWeight: vars.fontWeight.semiBold,
  //   }
  // }
})

// アクティブ状態を示すクラス名 (NavLink に付与する想定)
export const activeNavLink = style({
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 15%, transparent 85%)`,
  color: vars.color.primary,
  fontWeight: vars.fontWeight.semiBold
})

// リンク内のアイコンのスタイル
export const iconWrapper = style({
  display: 'inline-flex', // アイコンのサイズ調整のため
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px', // アイコンの表示領域幅 (固定)
  height: '24px',
  flexShrink: 0, // 縮まないように
  marginRight: vars.space[3], // テキストとの間隔

  // Tablet モード (アイコンのみ表示) ではマージンをなくす
  '@media': {
    [breakpoints.tablet]: {
      marginRight: 0
    }
  }
})

// リンク内のテキストのスタイル
export const linkText = style({
  opacity: 1,
  transition: 'opacity 0.1s ease-out',

  // Tablet モードではテキストを非表示にする
  '@media': {
    [breakpoints.tablet]: {
      opacity: 0,
      position: 'absolute', // レイアウトに影響を与えないように
      pointerEvents: 'none', // クリックなどを無効に
      width: '1px', // 完全に隠す
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)'
    }
  }
})
