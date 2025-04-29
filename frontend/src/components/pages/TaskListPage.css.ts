import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/theme.css'

// フィルターとソートコントロール全体を囲むコンテナ
export const controlsContainer = style({
  display: 'flex',
  justifyContent: 'space-between', // 左右に配置
  alignItems: 'center',
  marginBottom: vars.space[4], // 下にマージン
  flexWrap: 'wrap', // 画面が狭い場合に折り返す
  gap: vars.space[3] // 要素間のスペース
})

// フィルター要素（担当者、ラベル）をまとめるコンテナ
export const filterGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3], // フィルター間のスペース
  flexWrap: 'wrap' // 折り返し
})

// ソート要素（ラベル、セレクト）をまとめるコンテナ
export const sortGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2] // ラベルとセレクトの間隔
})

// ソート用ラベルのスタイル調整
export const sortLabel = style({
  marginBottom: 0, // デフォルトのマージンを打ち消し
  marginRight: vars.space[1],
  flexShrink: 0 // 縮まないように
})

// ソート用セレクトボックスの最小幅
export const sortSelect = style({
  minWidth: '180px'
})

// 選択中のラベルフィルター表示エリア
export const activeFiltersWrapper = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[1],
  alignItems: 'center',
  marginBottom: vars.space[3]
})

// 「フィルター中:」テキスト
export const activeFilterLabel = style({
  marginRight: vars.space[1]
})

// フィルタークリアボタン
export const clearFilterButton = style({
  height: 'auto', // Button Atom のデフォルト高さを上書き
  padding: `0 ${vars.space[1]}`, // 左右のパディングのみ
  fontSize: vars.fontSize.xs // 小さいフォント
  // 必要に応じて他のスタイルを追加
})

// 新規追加ボタンなどを配置するエリア
export const topButtonArea = style({
  marginBottom: vars.space[4], // 下にマージン
  display: 'flex',
  justifyContent: 'space-between', // ボタンを左右に配置
  alignItems: 'center'
})

// セクションタイトル (h2) の共通スタイル
export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.medium, // medium に変更
  marginBottom: vars.space[3], // 下マージン調整
  marginTop: vars.space[5], // 前のセクションとのマージン
  color: vars.color.textPrimary,

  // 最初のセクションタイトルには marginTop を適用しない
  selectors: {
    'section:first-of-type > &': {
      marginTop: 0
    }
  }
})

// 区切り線 (hr) のスタイル
export const separator = style({
  border: 'none', // デフォルトの線を消す
  borderTop: `1px solid ${vars.color.border}`, // 上線として表示
  margin: `${vars.space[5]} 0` // 上下のマージン
})
