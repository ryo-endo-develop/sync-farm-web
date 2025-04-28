import { style } from '@vanilla-extract/css'

import { vars } from '../../../styles/theme.css'

// ページネーション全体のコンテナ
export const container = style({
  display: 'flex',
  justifyContent: 'center', // 中央揃え
  alignItems: 'center',
  gap: vars.space[3], // 要素間のスペース (12px)
  marginTop: vars.space[5], // 上の要素とのマージン (20px)
  padding: `${vars.space[2]} 0`, // 上下のパディング (8px)
  userSelect: 'none' // テキスト選択不可
})

// ページ情報テキスト (例: "1 / 10 ページ")
export const pageInfo = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  minWidth: '120px', // 幅が変動しないように最小幅を設定 (任意)
  textAlign: 'center'
})

// ボタン共通スタイル (Button Atom を使うので不要な場合も)
// export const pageButton = style({ ... });
