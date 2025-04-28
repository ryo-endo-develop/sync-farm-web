import { style } from '@vanilla-extract/css'
import { vars } from '../../../styles/theme.css'
// TaskItem のスタイルを一部流用・参照
import {
  container,
  checkboxWrapper,
  content,
  details,
  actions
} from '../TaskItem/TaskItem.css'

// TaskItem のコンテナスタイルを流用
export const skeletonContainer = style([
  container({ isCompleted: false }), // 基本のコンテナスタイルを適用
  {
    cursor: 'default',
    ':hover': {
      // ホバー効果は不要なので上書き
      backgroundColor: 'transparent'
    }
  }
])

// チェックボックス部分のスケルトン
export const skeletonCheckbox = style([
  checkboxWrapper, // レイアウトを合わせる
  {
    // Skeleton Atom に直接スタイルを適用する
  }
])

// コンテンツ部分のスケルトン
export const skeletonContent = style([
  content, // レイアウトを合わせる
  {
    // 必要なら調整
  }
])

// タスク名部分のスケルトン (2行表示を模倣する場合など)
export const skeletonTextLine = style({
  marginBottom: vars.space[1], // 行間のマージン
  ':last-child': {
    marginBottom: 0
  }
})

// 詳細部分のスケルトン
export const skeletonDetails = style([
  details, // レイアウトを合わせる
  {
    // 必要なら調整
  }
])

// アクション部分のスケルトン
export const skeletonActions = style([
  actions, // レイアウトを合わせる
  {
    // 必要なら調整
  }
])
