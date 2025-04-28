import { style } from '@vanilla-extract/css'

import { breakpoints, vars } from '../../styles/theme.css'

// AppLayout 全体を囲む div
export const layout = style({
  display: 'flex',
  flexDirection: 'column', // Header が上、残りが下
  minHeight: '100vh', // 最低でも画面全体の高さに
  backgroundColor: vars.color.background // 全体の背景色
})

// Header を除く、ナビゲーションとメインコンテンツを囲むコンテナ
export const container = style({
  display: 'flex',
  flexGrow: 1, // Header 以外の残りの高さをすべて使う
  '@media': {
    // SP ではナビゲーションを非表示にする (後でドロワーにする想定)
    [breakpoints.sp]: {
      // display: 'block', // または flex のまま mainContent のみ表示
    }
  }
})

// サイドナビゲーション領域 (今はプレースホルダー用)
export const navPlaceholder = style({
  width: '240px', // PC でのナビゲーション幅 (例)
  backgroundColor: vars.color.surface, // ナビゲーションの背景色
  borderRight: `1px solid ${vars.color.border}`, // 右側に境界線
  flexShrink: 0, // コンテンツが増えても縮まないように
  padding: vars.space[4],
  display: 'block', // デフォルトで表示

  '@media': {
    [breakpoints.tablet]: {
      width: '80px' // Tablet ではアイコンのみ表示を想定した幅 (例)
      // アイコンのみにする場合は内部のテキストを隠すなどの工夫が必要
    },
    [breakpoints.sp]: {
      display: 'none' // SP では非表示
    }
  }
})

// メインコンテンツ領域 (children が表示される場所)
export const mainContent = style({
  flexGrow: 1, // 残りの幅をすべて使う
  padding: vars.space[6], // コンテンツ周りの余白 (24px)
  overflowY: 'auto' // 内容がはみ出た場合にスクロール
  // 必要に応じて最大幅などを設定
  // maxWidth: '1200px',
  // margin: '0 auto', // 中央揃えにする場合
})
